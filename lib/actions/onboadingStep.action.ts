"use server";

import "server-only";

import type { OnboardingStep } from "@/prisma/lib/generated/prisma/client";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
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

    await prismaAdapter.user.updateUserById(userId, {
      onboardingStep: step.onboardingStep,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true };
};
