"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";
import { api } from "../api";
import { ROUTES } from "../constants/routes";
import {
  addDerivAccountsToCollection,
  getDerivAccounts,
  removeDerivAccountFromCollection,
} from "../firebase/deriv";
import { setById } from "../firebase/firestore";
import { getTransactionById } from "../firebase/transactions";
import action from "../handlers/action";
import {
  getDerivAccountToken,
  paymentAgentWithdraw,
  verifyWithdrawEmail,
} from "../handlers/deriv";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import {
  divideNumbers,
  isSameRate,
  isWithinLimit,
  multiplyNumbers,
} from "../utils";
import { decryptToken, encryptDerivAccounts } from "../utils/server/encryption";
import {
  DerivAccountLinkSchema,
  DerivAccountSchema,
  DerivDepositSchema,
  DerivWithdrawalOTPSchema,
  DerivWithdrawalSchema,
} from "../validation";
import { fetchAgentAccount } from "./derivAgent.action";
import { fetchCachedRate } from "./rate.action";
import type { DerivDepositParams, DerivWithdrawalParams } from "./types/action";

export const getUserDerivAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<DerivAccount[]>> => {
  const user = await verifySession();

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = await getDerivAccounts(userId, { onlyActive });

    return { success: true, data: derivAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const addDerivAccounts = async (
  derivAccounts: DerivAccountLink[],
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccounts,
    schema: DerivAccountLinkSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedDerivAccounts } = result;

  const encryptedAccounts = encryptDerivAccounts(parsedDerivAccounts);

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await addDerivAccountsToCollection(encryptedAccounts, userId);
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeDerivAccount = async (
  derivAccount: DerivAccount,
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccount,
    schema: DerivAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedDerivAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await removeDerivAccountFromCollection({
      ...parsedDerivAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const createDerivDepositTransaction = async (
  derivDepositParams: DerivDepositParams,
): Promise<ActionResponse<{ transactionId: string }>> => {
  const result = await action({
    params: derivDepositParams,
    schema: DerivDepositSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const {
    session,
    params: {
      currency,
      paidFromAccountName,
      amount,
      derivLoginId,
      paidFromAccountNumber,
      paidFromBankCode,
      paidFromBankName,
      usedRate,
    },
  } = result;

  let transactionId = "";
  const userId = session?.user.id as string;

  try {
    const [rateRes, activeAccountRes] = await Promise.all([
      fetchCachedRate(currency),
      getUserDerivAccounts(userId, {
        onlyActive: true,
      }),
    ]);

    const acc = activeAccountRes.data?.find(
      (acc) => acc.accountId === derivLoginId,
    );

    if (!acc || !acc.active) throw new Error("You cannot fund this account");

    if (!rateRes.success || !rateRes.data)
      throw new Error(rateRes.error?.message || "Unable to fetch rate data");

    if (usedRate !== rateRes.data.depositRate)
      throw new Error("Rate changed. Please refresh and try again.");

    const convertedAmount = divideNumbers(amount, rateRes.data.depositRate);
    console.log(convertedAmount);

    if (
      convertedAmount < rateRes.data.depositMin ||
      convertedAmount > rateRes.data.depositMax
    ) {
      throw new Error(
        `Minimum deposit: ${rateRes.data.depositMin}, Maximum ${rateRes.data.depositMax}`,
      );
    }

    const transactionRef = db
      .collection("transactions")
      .where("status", "in", ["pending", "processing"])
      .where("type", "==", "deriv_deposit");

    const userPendingTransactionRef = transactionRef.where(
      "userId",
      "==",
      userId,
    );

    // Check to prevent users with similar name to have deposit transactions at the same time
    const duplicateUserPendingTransactionRef = transactionRef.where(
      "extra.paidFromAccountName",
      "==",
      paidFromAccountName,
    );

    await db.runTransaction(async (t) => {
      const pendingUserOrder = await t.get(userPendingTransactionRef);
      const similarOrder = await t.get(duplicateUserPendingTransactionRef);

      if (!pendingUserOrder.empty) {
        throw new Error(
          "You have a pending order. Please create a new order when your pending order has expired or completed",
        );
      }
      if (!similarOrder.empty) {
        throw new Error(
          "Similar order exist already. Please try again in few minutes",
        );
      }

      transactionId = uuidv4();

      const transactionsRef = db.collection("transactions").doc(transactionId);

      t.set(transactionsRef, {
        transactionId,
        userId,
        amount,
        status: "pending",
        type: "deriv_deposit",
        assignedBank: {
          bankName: "moniepoint bank",
          accountNumber: "00000000",
          acountName: "Evarest Direct Technologies",
        },
        extra: {
          amount: convertedAmount,
          currency,
          derivLoginId,
          paidFromBankName,
          paidFromBankCode,
          paidFromAccountNumber,
          paidFromAccountName,
        },
        createdAt: new Date(),
        updatedAt: new Date("2025-10-01T10:30:00Z"),
        fulfillment: {
          fulfilled: false,
        },
      } satisfies DerivDeposit);
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true, data: { transactionId } };
};

export const createDerivWithdrawalTransaction = async (
  derivWithdrawalParams: DerivWithdrawalParams,
): Promise<ActionResponse<{ transactionId: string }>> => {
  const result = await action({
    params: derivWithdrawalParams,
    schema: DerivWithdrawalSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const {
    session,

    params: {
      amount,
      currency,
      derivLoginId,
      receivingBankAccountNumber,
      receivingBankCode,
      receivingBankName,
      recievingBankAccountName,
      usedRate,
    },
  } = result;

  let transactionId = "";

  try {
    const userId = session?.user.id as string;

    const { success, data, error } = await fetchCachedRate(currency);

    if (!success || !data)
      throw new Error(error?.message || "Unable to fetch rate data");

    const { withdrawalMax, withdrawalMin, withdrawalRate } = data;

    if (!isSameRate(usedRate, withdrawalRate)) {
      throw new Error("Rate changed. Please refresh.");
    }

    if (!isWithinLimit(amount, withdrawalMin, withdrawalMax)) {
      throw new Error(
        `Minimum withdrawal: ${withdrawalMin}, Maximum ${withdrawalMax}`,
      );
    }

    transactionId = uuidv4();

    await setById("transactions", transactionId, {
      transactionId,
      userId,
      amount: multiplyNumbers(data.withdrawalRate, amount),
      status: "pending",
      type: "deriv_withdrawal",

      extra: {
        amount,
        currency,
        derivLoginId,
        receivingBankAccountNumber,
        receivingBankCode,
        receivingBankName,
        recievingBankAccountName,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      fulfillment: {
        fulfilled: false,
      },
    } satisfies DerivWithdrawal);

    return { success: true, data: { transactionId } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const processDerivWithdrawal = async (paymentData: {
  transactionId: string;
  pin: string;
}): Promise<ActionResponse> => {
  const result = await action({
    params: paymentData,
    schema: DerivWithdrawalOTPSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const {
    session,
    params: { pin, transactionId },
  } = result;

  const userId = session?.user.id;

  try {
    if (!userId) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction =
      ((await getTransactionById(transactionId)) as DerivWithdrawal) || null;

    if (!transaction) throw new Error("Transaction not found");

    const accountToken = await getDerivAccountToken(
      userId,
      transaction.extra.derivLoginId,
    );
    if (!accountToken) throw new Error("Account not found");

    const agentRes = await fetchAgentAccount(transaction.extra.currency);

    if (!agentRes.success || !agentRes.data) {
      throw new Error(
        agentRes.error?.message || "Unable to fetch agent account",
      );
    }

    const paymentAgentWithdrawResponse = await paymentAgentWithdraw({
      amount: transaction.extra.amount,
      currency: transaction.extra.currency,
      paymentagent_loginid: agentRes.data?.accountId as string,
      verification_code: pin,
      token: decryptToken(accountToken),
    });

    if (paymentAgentWithdrawResponse?.paymentagent_withdraw === 1) {
      await api.deriv.confirmClientWithdraw(transaction.transactionId);

      return { success: true };
    }
    throw new Error("Payment agent withdrawal failed");
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const triggerDerivDepositCompletion = async (
  transactionId: string,
): Promise<ActionResponse> => {
  const userId = await verifySession();

  try {
    if (!userId) {
      throw new UnauthorizedError("Not Authorized");
    }

    if (!transactionId || typeof transactionId !== "string") {
      throw new Error("Transaction id is required");
    }

    const transaction =
      ((await getTransactionById(transactionId)) as Transaction) || null;

    if (!transaction) throw new Error("Transaction not found");

    const res = await api.deriv.triggerCompleteDerivDeposit(transactionId);

    if (res.success) {
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const setDerivCookie = async (
  searchParams: string,
): Promise<ActionResponse> => {
  const user = await verifySession();
  console.log(searchParams);

  if (!user?.id || !searchParams || typeof searchParams !== "string") {
    return redirect(ROUTES.SIGN_IN);
  }

  const cookieStore = await cookies();

  cookieStore.set("deriv-accounts", searchParams, {
    maxAge: 900, // valid for 15mins
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  return { success: true };
};

export const sendWithdrawEmail = async ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}): Promise<ActionResponse<{ email: string }>> => {
  try {
    const accountToken = await getDerivAccountToken(userId, accountId);
    console.log(accountToken, 3434);
    if (!accountToken) throw new Error("Account not found");

    const result = await verifyWithdrawEmail({
      accountId: accountId,
      userToken: decryptToken(accountToken),
    });

    if (result?.isEmailSent) {
      return { success: true, data: { email: result.email as string } };
    }

    return { success: false };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
