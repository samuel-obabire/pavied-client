"use server";

import "server-only";

import type { UserStats } from "@/prisma/lib/generated/prisma/client";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import type { DecimalToNumber } from "../prisma-adapters/utils";
import { verifySession } from "../server";

export const getUserStats = async (
  userId: string,
): Promise<ActionResponse<DecimalToNumber<UserStats>>> => {
  const session = await verifySession();
  const loggedInUser = session?.user;

  try {
    if (!loggedInUser?.id || userId !== loggedInUser.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const stats = await prismaAdapter.stats.getUserStats(userId);

    if (!stats) throw new NotFoundError("User stats");

    return { success: true, data: stats };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
