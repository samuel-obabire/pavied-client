"use server";

import "server-only";
import { logger } from "@sentry/nextjs";
import { v4 as uuidv4 } from "uuid";
import { scheduleWithdrawalPayout } from "@/lib/utils/qstash";
import action from "../../handlers/action";
import {
  getDerivAccountToken,
  paymentAgentWithdraw,
  verifyWithdrawEmail,
} from "../../handlers/deriv";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import { prismaAdapter } from "../../prisma-adapters/prisma.adapter";
import {
  multiplyNumbers,
  scheduleOrderCancellation,
  transactionIsDerivWithdrawal,
} from "../../utils";
import { decryptToken } from "../../utils/server/encryption";
import {
  DerivWithdrawalOTPSchema,
  DerivWithdrawalSchema,
} from "../../validation";
import { fetchAgentAccount } from "../derivAgent.action";
import { fetchCachedRate } from "../rate.action";
import type { DerivWithdrawalParams } from "../types/action";
import {
  assertCurrencyisAvailable,
  assertCurrencyWithdrawIsAvailable,
  assertDerivWithdrawalEnabled,
  assertRateIsTheSame,
  assertSiteIsActive,
  assertUserAccountIsActive,
  assertUserCanWithdrawFromAccount,
  assertWithdrawAmountWithinCurrencyWithdrawLimits,
  assertWithdrawalAmountWithinSiteLimits,
} from "../validator";
import { getUserDerivAccounts } from "./account.action";

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

  const userId = session?.user.id as string;

  try {
    const [rateRes, activeAccountRes, siteConfig] = await Promise.all([
      fetchCachedRate(currency)(),
      getUserDerivAccounts(userId, {
        onlyActive: true,
      }),
      prismaAdapter.siteConfig.getSiteConfig(),
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

    const { withdrawalMax, withdrawalMin, withdrawalRate } = rateRes.data;

    assertSiteIsActive(siteConfig);
    assertDerivWithdrawalEnabled(siteConfig);
    await assertUserAccountIsActive(userId);
    await assertCurrencyWithdrawIsAvailable(currency);
    assertUserCanWithdrawFromAccount(activeAccountRes.data, currency);
    assertRateIsTheSame(withdrawalRate, usedRate);
    assertCurrencyisAvailable(rateRes.data, currency);
    assertWithdrawalAmountWithinSiteLimits(amount, siteConfig);
    assertWithdrawAmountWithinCurrencyWithdrawLimits(
      withdrawalMin,
      withdrawalMax,
      amount,
    );

    const convertedAmount = multiplyNumbers(withdrawalRate, amount);
    const transactionId =
      await prismaAdapter.derivFlow.createDerivWithdrawalTransaction({
        userId,
        transactionId: uuidv4(),
        amount,
        convertedAmount,
        currency,
        derivLoginId,
        receivingBankAccountNumber,
        receivingBankCode,
        receivingBankName,
        recievingBankAccountName,
      });

    // Autocancel the order after 30 mins of non-payment
    await scheduleOrderCancellation(transactionId, "Payment timeout", 30 * 60);

    return {
      success: true,
      data: { transactionId },
    };
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

  // revalidatePath("/deriv/withdrawal");

  try {
    if (!userId) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction =
      await prismaAdapter.transactions.getTransactionById(transactionId);

    if (!transaction) throw new Error("Transaction not found");

    if (
      !transaction.derivWithdrawalExtra ||
      !transactionIsDerivWithdrawal(transaction)
    )
      throw new Error("Invalid Transaction");

    const { amount, currency, derivLoginId } = transaction.derivWithdrawalExtra;

    const accountToken = await getDerivAccountToken(userId, derivLoginId);
    if (!accountToken) throw new Error("Account not found");

    const agentRes = await fetchAgentAccount(currency);

    if (!agentRes.success || !agentRes.data) {
      throw new Error(
        agentRes.error?.message || "Unable to fetch agent account",
      );
    }

    const paymentAgentWithdrawResponse = await paymentAgentWithdraw({
      amount: amount,
      currency: currency,
      paymentagent_loginid: agentRes.data?.accountId as string,
      verification_code: pin,
      token: decryptToken(accountToken),
    });

    if (paymentAgentWithdrawResponse?.paymentagent_withdraw === 1) {
      logger.info(
        `Deriv withdrawal tx: ${transactionId} successful with ref: ${paymentAgentWithdrawResponse.transaction_id}`,
      );

      await prismaAdapter.runDbTransaction(async (tx) => {
        const transaction = await tx.getTransaction(transactionId);
        if (!transaction) throw new Error("Transaction not found");

        if (transaction.status === "PENDING") {
          await tx.updateTransactionStatus(transactionId, "PROCESSING");
        }
      });

      await scheduleWithdrawalPayout(transactionId, 40).catch(logger.error);

      return { success: true };
    }

    throw new Error("Payment agent withdrawal failed please try again later");
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
