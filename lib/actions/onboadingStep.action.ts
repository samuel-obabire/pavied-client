"use server";

import "server-only";

import type { OnboardingStep } from "@/prisma/lib/generated/prisma/client";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { OnboardingStepSchema } from "../validation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";

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

    // 1. Update the database directly to bypass input: false restriction
    await prismaAdapter.user.updateUserById(userId, {
      onboardingStep: step.onboardingStep,
    });

    // 2. Trigger session refresh by updating a allowed field (name) with existing value
    // This forces better-auth to fetch the latest user data (including onboardingStep) and update the session cookie
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: session.user.name,
      },
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true };
};
