"use server";

import { revalidatePath } from "next/cache";

import { OnboardingStep, ROUTES } from "../constants";
import {
  addUserBankAcccountToCollection,
  addUserDerivAccountToCollection,
  removeUserBankAccountFromCollection,
  removeUserDerivAccountFromCollection,
  updateUserById,
} from "../firebase/user";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  AccountRegistrationSchema,
  bankAccountSchema,
  DerivAccountSchema,
  OnboardingStepSchema,
} from "../validation";

export const updateUser = async (
  userData: Partial<User>
): Promise<ActionResponse> => {
  const result = await action({
    params: userData,
    schema: AccountRegistrationSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: user } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await updateUserById(userId, {
      ...user,
    });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  return { success: true };
};

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

export const updateOnboardingStep = async (onboardingStep: {
  onboardingStep: OnboardingStep;
}): Promise<ActionResponse> => {
  const result = await action({
    params: onboardingStep,
    schema: OnboardingStepSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ActionResponse;
  }

  const { session, params: step } = result;

  const userId = session?.user.id;

  try {
    if (!userId) throw new UnauthorizedError("Not Authorized");

    await updateUserById(userId, { onboardingStep: step.onboardingStep });
  } catch (error) {
    return handleError(error) as ActionResponse;
  }

  return { success: true };
};

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
