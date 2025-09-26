"use server";

import { revalidatePath } from "next/cache";

import { DerivAccountLink } from "@/components/DerivAccountSelectionList";

import { ROUTES } from "../constants/routes";
import {
  addDerivAccountsToCollection,
  removeDerivAccountFromCollection,
} from "../firebase/deriv";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { DerivAccountLinkSchema, DerivAccountSchema } from "../validation";

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
