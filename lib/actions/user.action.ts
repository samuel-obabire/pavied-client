"use server";

import { updateUserById } from "../firebase/user";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
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
