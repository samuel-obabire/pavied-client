import prisma from "@/lib/prisma";
import type { BankAccount } from "@/prisma/lib/generated/prisma/client";

export const bankAdapter = {
  addUserBankAccount: async (
    userId: string,
    bankAccount: Pick<
      BankAccount,
      "bankCode" | "accountNumber" | "accountName" | "bankName"
    > &
      Partial<Pick<BankAccount, "active">>,
  ) => {
    await prisma.$transaction(async (tx) => {
      const [existingBankAccount, userBankAccountsCount] = await Promise.all([
        tx.bankAccount.findFirst({
          where: {
            bankCode: bankAccount.bankCode,
            accountNumber: bankAccount.accountNumber,
          },
        }),
        tx.bankAccount.count({
          where: { userId },
        }),
      ]);

      if (existingBankAccount) {
        throw new Error("Account already exist in the database");
      }

      if (userBankAccountsCount >= 3) {
        throw new Error("You can only add up to 3 bank accounts");
      }

      await tx.bankAccount.create({
        data: {
          accountName: bankAccount.accountName,
          accountNumber: bankAccount.accountNumber,
          bankName: bankAccount.bankName,
          bankCode: bankAccount.bankCode,
          user: {
            connect: { id: userId },
          },
        },
      });
    });
  },

  removeBankAccount: async ({
    bankCode,
    accountNumber,
    userId,
  }: Pick<BankAccount, "bankCode" | "accountNumber" | "userId">) => {
    await prisma.bankAccount.deleteMany({
      where: {
        bankCode,
        accountNumber,
        userId,
      },
    });
  },

  getBankAccounts: async (userId: string, onlyActive = false) => {
    return await prisma.bankAccount.findMany({
      where: {
        userId,
        ...(onlyActive && { active: true }),
      },
    });
  },
};
