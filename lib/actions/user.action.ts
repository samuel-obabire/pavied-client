"use server";

import "server-only";

import type z from "zod";
import type { User } from "@/prisma/lib/generated/prisma/client";
import type { UserUpdateInput } from "@/prisma/lib/generated/prisma/models";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import { verifySession } from "../server";
import { AccountRegistrationSchema } from "../validation";

export const updateUser = async (
  userData: z.infer<typeof AccountRegistrationSchema>,
): Promise<ActionResponse> => {
  const result = await action({
    params: userData,
    schema: AccountRegistrationSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: user } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await prismaAdapter.user.updateUserById(userId, user as UserUpdateInput);
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true };
};

export const getUserById = async (
  userId: string,
): Promise<ActionResponse<User>> => {
  const session = await verifySession();
  const user = session?.user;

  try {
    if (!user?.id || userId !== user.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const userData = await prismaAdapter.user.getUserById(userId);

    if (!userData) throw new NotFoundError("User");

    return { success: true, data: userData };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
