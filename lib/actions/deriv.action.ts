"use server";

import { revalidatePath } from "next/cache";

import { ROUTES } from "../constants/routes";
import {
  addUserDerivAccountToCollection,
  removeUserDerivAccountFromCollection,
} from "../firebase/user";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { DerivAccountSchema } from "../validation";

export const addUserDerivAccount = async (
  derivAccount: DerivAccount
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccount,
    schema: DerivAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: parsedDerivAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await addUserDerivAccountToCollection({ ...parsedDerivAccount, userId });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeUserDerivAccount = async (
  derivAccount: DerivAccount
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccount,
    schema: DerivAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: parsedDerivAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await removeUserDerivAccountFromCollection({
      ...parsedDerivAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};
