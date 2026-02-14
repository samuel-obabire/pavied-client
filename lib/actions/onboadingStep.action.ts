"use server";

import "server-only";

import type { OnboardingStep } from "@/prisma/lib/generated/prisma/client";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { OnboardingStepSchema } from "../validation";

export const updateOnboardingStep = async (data: {
  onboardingStep: OnboardingStep;
}): Promise<ActionResponse> => {
  const result = await action({
    params: data,
    schema: OnboardingStepSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: step } = result;

  const userId = session?.user.id;

  try {
    if (!userId) throw new UnauthorizedError("Not Authorized");

    await firestoreAdapter.user.updateUserById(userId, {
      onboardingStep: step.onboardingStep,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true };
};
