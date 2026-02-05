"use server";

import "server-only";
import { Client } from "@upstash/qstash";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";
import { api } from "../api";
import { ROUTES } from "../constants/routes";
import { setById } from "../firebase/firestore";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import action from "../handlers/action";
import {
  getDerivAccountToken,
  paymentAgentWithdraw,
  verifyWithdrawEmail,
} from "../handlers/deriv";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import logger from "../logger";
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
import {
  assertCurrencyisAvailable,
  assertDepositAmountWithinCurrencyDepositLimits,
  assertDepositAmountWithinSiteLimits,
  assertDerivPaymentEnabled,
  assertRateIsTheSame,
  assertSiteIsActive,
  assertUserAccountIsActive,
  assertUserCanFundTheAccount,
} from "./validator";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export const getUserDerivAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<DerivAccount[]>> => {
  const user = await verifySession();

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = await firestoreAdapter.deriv.getDerivAccounts(
      userId,
      {
        onlyActive,
      },
    );

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

    await firestoreAdapter.runTransaction(async (tx) => {
      for (const account of encryptedAccounts) {
        const existingAccount = await tx.getDerivAccount(account);

        if (existingAccount) {
          if (existingAccount.userId !== userId) {
            throw new Error(
              `Account ${account.accountId} already exist in database with another user`,
            );
          }
        }

        await tx.addDerivAccount({ ...account, active: false }, userId);
      }
    });
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

    await firestoreAdapter.deriv.removeDerivAccount({
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

  const userId = session?.user.id as string;

  try {
    const [rateRes, activeAccountRes, siteConfig, assignedAccount] =
      await Promise.all([
        fetchCachedRate(currency)(),
        getUserDerivAccounts(userId, {
          onlyActive: true,
        }),
        firestoreAdapter.siteConfig.getSiteConfig(),
        firestoreAdapter.adminBank.getAdminDefaultBankAccount(),
      ]);

    if (!rateRes.data)
      throw new Error(rateRes.error?.message || "Unable to fetch rate data");

    if (!siteConfig) {
      logger.error("Unable to fetch site settings");
      throw new Error("Unable to complete your request");
    }

    if (!activeAccountRes.data) {
      throw new Error("Unable to fetch user accounts");
    }

    if (!assignedAccount || !assignedAccount.isActive) {
      logger.warn("No account is active for deposit");
      throw new Error("Unable to complete request");
    }

    const convertedAmount = divideNumbers(amount, rateRes.data.depositRate);

    assertSiteIsActive(siteConfig);
    assertDerivPaymentEnabled(siteConfig);
    await assertUserAccountIsActive(userId);
    assertUserCanFundTheAccount(activeAccountRes.data, currency);
    assertCurrencyisAvailable(rateRes.data, currency);
    assertDepositAmountWithinSiteLimits(convertedAmount, siteConfig);
    assertDepositAmountWithinCurrencyDepositLimits(
      rateRes.data.depositMin,
      rateRes.data.depositMax,
      convertedAmount,
    );
    assertRateIsTheSame(rateRes.data.depositRate, usedRate);

    // const transactionRef = db
    //   .collection("transactions")
    //   .where("status", "in", ["pending", "processing"])
    //   .where("type", "==", "deriv_deposit");

    // const userPendingTransactionRef = transactionRef.where(
    //   "userId",
    //   "==",
    //   userId,
    // );

    // // Check to prevent users with similar name to have deposit transactions at the same time
    // const duplicateUserPendingTransactionRef = transactionRef.where(
    //   "extra.paidFromAccountName",
    //   "==",
    //   paidFromAccountName,
    // );

    const transactionId = await db.runTransaction(async (t) => {
      // const pendingUserOrder = await t.get(userPendingTransactionRef.limit(1));
      // const similarOrder = await t.get(
      //   duplicateUserPendingTransactionRef.limit(1),
      // );

      // if (!pendingUserOrder.empty) {
      //   throw new Error(
      //     "You have a pending order. Please create a new order when your pending order has expired or completed",
      //   );
      // }
      // if (!similarOrder.empty) {
      //   throw new Error(
      //     "Unable to complete your request. Please try again in few minutes",
      //   );
      // }

      const txId = uuidv4();

      const transactionsRef = db.collection("transactions").doc(txId);

      t.set(transactionsRef, {
        transactionId: txId,
        userId,
        amount,
        status: "pending",
        type: "deriv_deposit",
        assignedBank: {
          bankName: assignedAccount.bankName,
          accountNumber: assignedAccount.accountNumber,
          acountName: assignedAccount.accountName,
          id: assignedAccount.id,
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
        updatedAt: new Date(),
        fulfillment: {
          fulfilled: false,
        },
      } satisfies DerivDeposit);

      return txId;
    });

    // Automatically cancel order if not paid within 15 mins
    // await client.publishJSON({
    //   url: `${process.env.NEXT_PUBLIC_URL}/api/cancel-order`,
    //   body: { transactionId, reason: "Payment timeout" },
    //   delay: 15 * 60, // cancel after 15mins
    // });

    return { success: true, data: { transactionId } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
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

  try {
    const userId = session?.user.id as string;

    const { success, data, error } = await fetchCachedRate(currency)();

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

    const transactionId = uuidv4();

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

    // 👇 Once uploading is done, queue an image processing task
    // const result = await client.publishJSON({
    //   url: "https://your-api-endpoint.com/process-image",
    //   body: { imageId: "123" },
    // });

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
      ((await firestoreAdapter.transactions.getTransactionById(
        transactionId,
      )) as DerivWithdrawal) || null;

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
      ((await firestoreAdapter.transactions.getTransactionById(
        transactionId,
      )) as Transaction) || null;

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
