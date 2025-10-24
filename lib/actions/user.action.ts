"use server";

import "server-only";

import { getUserById, updateUserById } from "../firebase/user";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import { AccountRegistrationSchema } from "../validation";

export const updateUser = async (
  userData: Partial<User>
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

    await updateUserById(userId, {
      ...user,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  return { success: true };
};

export const getUser = async (
  userId: string
): Promise<ActionResponse<User>> => {
  const loggedInUser = await verifySession();

  try {
    if (!loggedInUser?.id || userId !== loggedInUser.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const userData = await getUserById(userId);

    if (!userData) throw new NotFoundError("User");

    return { success: true, data: userData };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
