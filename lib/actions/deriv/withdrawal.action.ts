"use server";

import "server-only";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../api";
import { setById } from "../../firebase/firestore";
import { firestoreAdapter } from "../../firebase/firestore.adapter";
import action from "../../handlers/action";
import {
  getDerivAccountToken,
  paymentAgentWithdraw,
  verifyWithdrawEmail,
} from "../../handlers/deriv";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import { isSameRate, isWithinLimit, multiplyNumbers } from "../../utils";
import { decryptToken } from "../../utils/server/encryption";
import {
  DerivWithdrawalOTPSchema,
  DerivWithdrawalSchema,
} from "../../validation";
import { fetchAgentAccount } from "../derivAgent.action";
import { fetchCachedRate } from "../rate.action";
import type { DerivWithdrawalParams } from "../types/action";

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

export const sendWithdrawEmail = async ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}): Promise<ActionResponse<{ email: string }>> => {
  try {
    const accountToken = await getDerivAccountToken(userId, accountId);

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
