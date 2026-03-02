"use server";

import "server-only";

import { logger } from "better-auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { BankAccount } from "@/prisma/lib/generated/prisma/client";
import { ROUTES } from "../constants/routes";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import { verifySession } from "../server";
import { bankAccountSchema } from "../validation";
import { notifyAdmin } from "../telegram/notification";

export const getUserBankAccounts = async (
  userId: string,
  { onlyActive }: { onlyActive: boolean } = { onlyActive: false },
): Promise<ActionResponse<BankAccount[]>> => {
  const session = await verifySession();
  const user = session?.user;

  try {
    if (!userId || !user?.id || userId !== user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const bankAccounts = await prismaAdapter.bank.getBankAccounts(
      userId,
      onlyActive,
    );

    return { success: true, data: bankAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const addUserBankAccount = async (
  bankAccount: Pick<
    BankAccount,
    "accountName" | "accountNumber" | "bankCode" | "bankName"
  >,
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await prismaAdapter.bank.addUserBankAccount(userId, parsedBankAccount);

    after(async () => {
      await notifyAdmin(
        `${userId} just added a bank account. Requires approval`,
      ).catch(logger.error);
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_DERIV);

  return { success: true };
};

export const removeUserBankAccount = async (
  bankAccount: BankAccount,
): Promise<ActionResponse> => {
  const result = await action({
    params: bankAccount,
    schema: bankAccountSchema.server,
    authorise: true,
  });

  if (result instanceof Error) {
    return handleError(result) as ErrorResponse;
  }

  const { session, params: parsedBankAccount } = result;

  try {
    const userId = session?.user.id;

    if (!userId) throw new UnauthorizedError("Not Authorized");

    await prismaAdapter.bank.removeBankAccount({
      ...parsedBankAccount,
      userId,
    });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

  revalidatePath(ROUTES.SETUP_BANK);

  return { success: true };
};
