"use server";

import "server-only";

import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import { verifySession } from "../server";

export const getUserStats = async (
  userId: string,
): Promise<ActionResponse<UserStats>> => {
  const session = await verifySession();
  const loggedInUser = session?.user;

  try {
    if (!loggedInUser?.id || userId !== loggedInUser.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const stats = await prismaAdapter.stats.getUserStats(userId);

    if (!stats) throw new NotFoundError("User");

    return { success: true, data: stats };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
