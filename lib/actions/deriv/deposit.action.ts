"use server";

import "server-only";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import type { DerivAccount } from "@/prisma/lib/generated/prisma/client";
import { firestoreAdapter } from "../../firebase/firestore.adapter";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import logger from "../../logger";
import { divideNumbers, scheduleOrderCancellation } from "../../utils";
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
      firestoreAdapter.siteConfig.getSiteConfig(),
      firestoreAdapter.adminBank.getAdminActiveBankAccounts(),
      firestoreAdapter.stats.getUserStats(userId),
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

    const transactionId = await prisma.$transaction(async (tx) => {
      // Check for pending/processing orders for this user
      const pendingUserOrder = await tx.transaction.findFirst({
        where: {
          userId,
          status: { in: ["PENDING", "PROCESSING"] },
          type: "DERIV_DEPOSIT",
        },
      });

      if (pendingUserOrder) {
        throw new Error(
          "You have a pending order. Please create a new order when your pending order has expired or completed",
        );
      }

      // Check to prevent users with similar bank account from having deposit transactions at the same time
      const similarOrder = await tx.transaction.findFirst({
        where: {
          status: { in: ["PENDING", "PROCESSING"] },
          type: "DERIV_DEPOSIT",
          derivDepositExtra: {
            is: {
              paidFromAccountName,
            },
          },
        },
      });

      if (similarOrder) {
        throw new Error(
          "Unable to complete your request. Please try again in few minutes",
        );
      }

      const txId = uuidv4();

      const transaction = await tx.transaction.create({
        data: {
          transactionId: txId,
          amount,
          status: "PENDING",
          type: "DERIV_DEPOSIT",
          fulfillmentFulfilled: false,
          derivDepositExtra: {
            create: {
              currency,
              amount: convertedAmount,
              derivLoginId,
              paidFromBankName,
              paidFromBankCode,
              paidFromAccountNumber,
              paidFromAccountName,
              assignedBankId: assignedAccount.id,
              assignedBankName: assignedAccount.bankName,
              assignedBankAccountName: assignedAccount.accountName,
              assignedBankAccountNumber: assignedAccount.accountNumber,
            },
          },
          user: { connect: { id: userId } },
        },
        include: {
          derivDepositExtra: true,
        },
      });

      return transaction.transactionId;
    });

    // Automatically cancel order if not paid within 15 mins
    await scheduleOrderCancellation(transactionId, "Payment timeout");

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
}
