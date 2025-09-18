"use server";

import { revalidatePath } from "next/cache";

import { ROUTES } from "../constants/routes";
import {
  addUserBankAcccountToCollection,
  removeUserBankAccountFromCollection,
} from "../firebase/user";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { bankAccountSchema } from "../validation";

export const addUserBankAccount = async (
  bankAccount: BankAccount
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await addUserBankAcccountToCollection({ ...parsedBankAccount, userId });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeUserBankAccount = async (
  bankAccount: BankAccount
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await removeUserBankAccountFromCollection({
      ...parsedBankAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  revalidatePath(ROUTES.SETUP_BANK);

  return { success: true };
};
