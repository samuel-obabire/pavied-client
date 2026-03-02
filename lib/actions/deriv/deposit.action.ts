"use server";

import "server-only";
import { after } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { notifyAdmin } from "@/lib/telegram/notification";
import type { DerivAccount } from "@/prisma/lib/generated/prisma/client";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import logger from "../../logger";
import { prismaAdapter } from "../../prisma-adapters/prisma.adapter";
import {
  divideNumbers,
  formatNairaAmount,
  scheduleOrderCancellation,
} from "../../utils";
import { DerivDepositSchema } from "../../validation";
import { fetchCachedRate } from "../rate.action";
import type { DerivDepositParams } from "../types/action";
import {
  assertCurrencyisAvailable,
  assertDepositAmountWithinCurrencyDepositLimits,
  assertDepositAmountWithinSiteLimits,
  assertDerivDepositEnabled,
  assertRateIsTheSame,
  assertSiteIsActive,
  assertUserAccountIsActive,
  assertUserCanFundTheAccount,
} from "../validator";
import { assignDepositBankAccount } from "./bankAccountSelector";

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
    const [
      rateRes,
      activeAccountRes,
      siteConfig,
      adminActiveBankAccounts,
      userStats,
    ] = await Promise.all([
      fetchCachedRate(currency)(),
      getUserDerivAccounts(userId, {
        onlyActive: true,
      }),
      prismaAdapter.siteConfig.getSiteConfig(),
      prismaAdapter.adminBank.getAdminActiveBankAccounts(),
      prismaAdapter.stats.getUserStats(userId),
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

    if (!userStats) {
      logger.warn("unable to find user stats please try later");
      throw new Error("Unable to complete your request");
    }

    if (!adminActiveBankAccounts || !adminActiveBankAccounts.length) {
      logger.warn("No account is active for deposit");
      throw new Error("Unable to complete request. Please try again later.");
    }

    const convertedAmount = divideNumbers(amount, rateRes.data.depositRate);

    assertSiteIsActive(siteConfig);
    assertDerivDepositEnabled(siteConfig);
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

    const assignedAccount = assignDepositBankAccount({
      adminAcc: adminActiveBankAccounts,
      clientBankCode: paidFromBankCode,
      clientTotalTransactions: userStats.totalDeposits,
      nairaAmountToFund: amount,
    });

    if (!assignedAccount) {
      logger.error(
        `Unable to assign bank account for ${userId} ${paidFromBankName} ${paidFromBankCode}`,
      );
      throw new Error(
        "Unable to complete your request. Please select a different bank or try again later",
      );
    }

    const transactionId =
      await prismaAdapter.derivFlow.createDerivDepositTransaction({
        userId,
        transactionId: uuidv4(),
        amount,
        convertedAmount,
        currency,
        derivLoginId,
        paidFromBankName,
        paidFromBankCode,
        paidFromAccountNumber,
        paidFromAccountName,
        assignedBankId: assignedAccount.id,
        assignedBankName: assignedAccount.bankName,
        assignedBankAccountName: assignedAccount.accountName,
        assignedBankAccountNumber: assignedAccount.accountNumber,
      });

    // Automatically cancel order if not paid within 15 mins
    await scheduleOrderCancellation(transactionId, "Payment timeout");

    after(async () => {
      await notifyAdmin(
        `${userId} just created a deposit transaction of ${formatNairaAmount(amount)}.`,
      ).catch(logger.error);
    });

    return { success: true, data: { transactionId } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

async function getUserDerivAccounts(
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<DerivAccount[]>> {
  try {
    if (!userId) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = await prismaAdapter.deriv.getDerivAccounts(userId, {
      onlyActive,
    });

    return { success: true, data: derivAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
