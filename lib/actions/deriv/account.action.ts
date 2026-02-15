"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import type { DerivAccount } from "@/prisma/lib/generated/prisma/client";
import { ROUTES } from "../../constants/routes";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import { prismaAdapter } from "../../prisma-adapters/prisma.adapter";
import { verifySession } from "../../server";
import { DerivAccountLinkSchema, DerivAccountSchema } from "../../validation";

export const getUserDerivAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<DerivAccount[]>> => {
  const session = await verifySession();
  const user = session?.user;

  try {
    if (!userId || !user?.id || userId !== user.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = await prismaAdapter.deriv.getDerivAccounts(userId, {
      onlyActive,
    });

    return { success: true, data: derivAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const addDerivAccounts = async (
  derivAccounts: DerivAccountLink[],
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccounts,
    schema: DerivAccountLinkSchema,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedDerivAccounts } = result;

  const { encryptDerivAccounts } = await import(
    "../../utils/server/encryption"
  );

  const encryptedAccounts = encryptDerivAccounts(parsedDerivAccounts);

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await prismaAdapter.derivFlow.syncUserDerivAccounts(
      userId,
      encryptedAccounts,
    );
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeDerivAccount = async (
  derivAccount: DerivAccount,
): Promise<ActionResponse> => {
  const result = await action({
    params: derivAccount,
    schema: DerivAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedDerivAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await prismaAdapter.deriv.removeDerivAccount(parsedDerivAccount.accountId);
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const setDerivCookie = async (
  searchParams: string,
): Promise<ActionResponse> => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id || !searchParams || typeof searchParams !== "string") {
    return redirect(ROUTES.SIGN_IN);
  }

  const cookieStore = await cookies();

  cookieStore.set("deriv-accounts", searchParams, {
    maxAge: 900, // valid for 15mins
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  return { success: true };
};
