"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";

import { ROUTES } from "../constants/routes";
import {
  addDerivAccountsToCollection,
  getDerivAccounts,
  removeDerivAccountFromCollection,
} from "../firebase/deriv";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import {
  DerivAccountLinkSchema,
  DerivAccountSchema,
  DerivDepositSchema,
} from "../validation";
import { DerivDepositParams } from "./types/action";

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

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await addDerivAccountsToCollection(parsedDerivAccounts, userId);
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

export const createDepositTransaction = async (
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
    depositBankAccount: { accountName, accountNumber, bankCode, bankName },
    depositDerivAccount: { accountId, currency },
    nairaAmount,
  } = result.params;

  const { session, params: depositParams } = result;

  let transactionId: string = "";

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    const userPendingTransactionRef = db
      .collection("transactions")
      .where("userId", "==", userId)
      .where("status", "==", "pending");

    const duplicateUserPendingTransactionRef = db
      .collection("transactions")
      .where(
        "depositBankAccount.accountName",
        "==",
        depositParams.depositBankAccount.accountName
      )
      .where("status", "==", "pending");

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
        amount: nairaAmount,
        status: "pending",
        type: "deriv_deposit",
        assignedBank: {
          bankName: "moniepoint bank",
          accountNumber: "00000000",
          acountName: "Evarest Direct Technologies",
        },
        extra: {
          currency,
          derivLoginId: accountId,
          paidFromBankName: bankName,
          paidFromBankCode: bankCode,
          paidFromAccountNumber: accountNumber,
          paidFromAccountName: accountName,
        },
        createdAt: new Date(),
        updatedAt: new Date("2025-10-01T10:30:00Z"),
        fulfillment: {
          fulfilled: false,
          // actorId: "admin_01",
          // referenceId: "ref_1001",
          // note: "Deposit confirmed via bank transfer.",
        },
      } satisfies Transaction);
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true, data: { transactionId } };
};
