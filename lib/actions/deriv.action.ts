"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";

import { ROUTES } from "../constants/routes";
import {
  addDerivAccountsToCollection,
  getDerivAccounts,
  removeDerivAccountFromCollection,
} from "../firebase/deriv";
import { getTransactionById } from "../firebase/transactions";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import {
  DerivAccountLinkSchema,
  DerivAccountSchema,
  DerivDepositSchema,
  DerivWithdrawalOTPSchema,
  DerivWithdrawalSchema,
} from "../validation";
import { updatePaymentTransaction } from "./payment.action";
import { DerivDepositParams, DerivWithdrawalParams } from "./types/action";
import { setById } from "../firebase/firestore";
import {
  verifyWithdrawEmail,
  paymentAgentWithdraw,
  getDerivAccountToken,
} from "../handlers/deriv";
import { decryptToken, encryptDerivAccounts } from "../utils/server/encryption";

export const getUserDerivAccounts = async (
  userId: string
): Promise<ActionResponse<DerivAccount[]>> => {
  const user = await verifySession();

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = (await getDerivAccounts(userId)).map((acc) => {
      const modifiedAccount = acc;

      delete modifiedAccount.token;
      return modifiedAccount;
    });

    return { success: true, data: derivAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const addDerivAccounts = async (
  derivAccounts: DerivAccountLink[]
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
  derivAccount: DerivAccount
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
  derivDepositParams: DerivDepositParams
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
    },
  } = result;

  let transactionId: string = "";

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    const transactionRef = db
      .collection("transactions")
      .where("status", "in", ["pending", "processing"])
      .where("type", "==", "deriv_deposit");

    const userPendingTransactionRef = transactionRef.where(
      "userId",
      "==",
      userId
    );

    // Check to prevent users with similar name to have deposit transactions at the same time
    const duplicateUserPendingTransactionRef = transactionRef.where(
      "extra.paidFromAccountName",
      "==",
      paidFromAccountName
    );

    await db.runTransaction(async (t) => {
      const pendingUserOrder = await t.get(userPendingTransactionRef);
      const similarOrder = await t.get(duplicateUserPendingTransactionRef);

      if (!pendingUserOrder.empty) {
        throw new Error(
          "You have a pending order. Please create a new order when your pending order has expired or completed"
        );
      }
      if (!similarOrder.empty) {
        throw new Error(
          "Similar order exist already. Please try again in few minutes"
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
          amount: amount / 1500, // Todo: get rate from database
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
  derivWithdrawalParams: DerivWithdrawalParams
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
    },
  } = result;

  let transactionId: string = "";

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    transactionId = uuidv4();

    await setById("transactions", transactionId, {
      transactionId,
      userId,
      amount: 1500 * amount,
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

    const accountToken = await getDerivAccountToken(userId, derivLoginId);
    if (!accountToken) throw new Error("Account not found");

    await verifyWithdrawEmail({
      accountId: derivLoginId,
      userToken: decryptToken(accountToken),
    });

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

  const { session, params } = result;

  const userId = session?.user.id;

  try {
    if (!userId) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction =
      ((await getTransactionById(
        paymentData.transactionId
      )) as DerivWithdrawal) || null;

    if (!transaction) throw new Error("Transaction not found");

    const accountToken = await getDerivAccountToken(
      userId,
      transaction.extra.derivLoginId
    );
    if (!accountToken) throw new Error("Account not found");

    const paymentAgentWithdrawResponse = await paymentAgentWithdraw({
      amount: transaction.extra.amount,
      currency: transaction.extra.currency,
      paymentagent_loginid: "CR2091245", // Todo: get the id from database
      verification_code: paymentData.pin,
      token: decryptToken(accountToken),
    });

    if (paymentAgentWithdrawResponse?.paymentagent_withdraw === 1) {
      const { transactionId } = params;

      const { success } = await updatePaymentTransaction(transactionId, {
        status: "processing",
      });

      return { success };
    }

    throw new Error("Payment agent withdrawal failed");
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const setDerivCookie = async (
  searchParams: string
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
