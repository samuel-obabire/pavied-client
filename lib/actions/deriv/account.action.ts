"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { ROUTES } from "../../constants/routes";
import { firestoreAdapter } from "../../firebase/firestore.adapter";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { UnauthorizedError } from "../../http-errors";
import { verifySession } from "../../server";
import { DerivAccountLinkSchema, DerivAccountSchema } from "../../validation";

export const getUserDerivAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<DerivAccount[]>> => {
  const user = await verifySession();

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const derivAccounts = await firestoreAdapter.deriv.getDerivAccounts(
      userId,
      {
        onlyActive,
      },
    );

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

    await firestoreAdapter.runTransaction(async (tx) => {
      // First, perform all reads for accounts to satisfy Firestore
      // requirement that reads must complete before any writes in a transaction.
      const reads: Array<{
        account: (typeof encryptedAccounts)[number];
        existingAccount: any;
      }> = [];

      for (const account of encryptedAccounts) {
        const existingAccount = await tx.getDerivAccount(account);
        reads.push({ account, existingAccount });
      }

      // Validate reads
      for (const { account, existingAccount } of reads) {
        if (existingAccount && existingAccount.userId !== userId) {
          throw new Error(
            `Account ${account.accountId} already exist in database with another user`,
          );
        }
      }

      // Now perform writes
      for (const account of encryptedAccounts) {
        await tx.addDerivAccount({ ...account, active: false }, userId);
      }
    });
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

    await firestoreAdapter.deriv.removeDerivAccount({
      ...parsedDerivAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const setDerivCookie = async (
  searchParams: string,
): Promise<ActionResponse> => {
  const user = await verifySession();
  console.log(searchParams);

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
