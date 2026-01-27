"use server";

import "server-only";

import { firestoreAdapter } from "../firebase/firestore.adapter";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";

export const getUserStats = async (
  userId: string,
): Promise<ActionResponse<UserStats>> => {
  const loggedInUser = await verifySession();

  try {
    if (!loggedInUser?.id || userId !== loggedInUser.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const stats = await firestoreAdapter.stats.getUserStats(userId);

    if (!stats) throw new NotFoundError("User");

    return { success: true, data: stats };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
