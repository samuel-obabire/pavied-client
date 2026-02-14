import prisma from "@/lib/prisma";
import type { BankAccount } from "@/prisma/lib/generated/prisma/client";

export const bankAdapter = {
  removeBankAccount: async ({
    bankCode,
    accountNumber,
    userId,
  }: Partial<BankAccount>) => {
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
