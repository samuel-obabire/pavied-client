"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { ROUTES } from "../constants/routes";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import { bankAccountSchema } from "../validation";

export const getUserBankAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<BankAccount[]>> => {
  const user = await verifySession();

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const bankAccounts = await firestoreAdapter.bank.getBankAccounts(
      userId,
      onlyActive,
    );

    return { success: true, data: bankAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const addUserBankAccount = async (
  bankAccount: BankAccount,
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    const { bankCode, accountNumber } = parsedBankAccount;

    await firestoreAdapter.runTransaction(async (tx) => {
      const existingBankAccount = await tx.getBankAccount(
        bankCode,
        accountNumber,
      );

      if (existingBankAccount)
        throw new Error("Account already exist in the database");

      tx.addBankAccount(bankAccount, userId);
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeUserBankAccount = async (
  bankAccount: BankAccount,
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await firestoreAdapter.bank.removeBankAccount({
      ...parsedBankAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_BANK);

  return { success: true };
};
