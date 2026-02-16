import prisma from "@/lib/prisma";

export const adminBankAdapter = {
  getAdminActiveBankAccounts: async () => {
    return await prisma.adminBankAccount.findMany({
      where: {
        isActive: true,
      },
    });
  },

  getAdminDefaultBankAccount: async () => {
    return await prisma.adminBankAccount.findFirst({
      where: {
        default: true,
      },
    });
  },
};
