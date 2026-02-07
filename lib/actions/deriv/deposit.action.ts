"use server";

import "server-only";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase/firebase.config";
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
      clientTotalTransactions: 0,
      nairaAmountToFund: amount,
    });

    if (!assignedAccount) {
      logger.error(`Unable to assign bank account for ${userId}`);
      throw new Error(
        "Unable to complete your request. Please try again later",
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

    const transactionId = await db.runTransaction(async (t) => {
      const pendingUserOrder = await t.get(userPendingTransactionRef.limit(1));
      const similarOrder = await t.get(
        duplicateUserPendingTransactionRef.limit(1),
      );

      if (!pendingUserOrder.empty) {
        throw new Error(
          "You have a pending order. Please create a new order when your pending order has expired or completed",
        );
      }
      if (!similarOrder.empty) {
        throw new Error(
          "Unable to complete your request. Please try again in few minutes",
        );
      }

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
          accountName: assignedAccount.accountName,
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
