import prisma from "@/lib/prisma";

export const adminBankAdapter = {
  addAdminBankAccount: async (
    bankAccount: Omit<AdminBankAccount, "createdAt" | "updatedAt">,
  ) => {
    return await prisma.adminBankAccount.create({
      data: {
        id: bankAccount.id,
        accountName: bankAccount.accountName,
        accountNumber: bankAccount.accountNumber,
        bankName: bankAccount.bankName,
        bankCode: bankAccount.bankCode,
        syncedBanks: JSON.stringify(bankAccount.syncedBanks || []),
        blackListedBanks: JSON.stringify(bankAccount.blackListedBanks || []),
        minAmountAllowed: bankAccount.minAmountAllowed,
        maxAmountAllowed: bankAccount.maxAmountAllowed,
        requireManualConfirmation: bankAccount.requireManualConfirmation,
        dailyCap: bankAccount.dailyCap,
        default: bankAccount.default,
        isActive: bankAccount.isActive,
      },
    });
  },

  getAdminActiveBankAccounts: async () => {
    return await prisma.adminBankAccount.findMany({
      where: {
        isActive: true,
      },
    });
  },

  updateAdminBankAccount: async (
    bankAccountId: string,
    data: Partial<AdminBankAccount>,
  ) => {
    return await prisma.adminBankAccount.update({
      where: { id: bankAccountId },
      data: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        bankCode: data.bankCode,
        syncedBanks: data.syncedBanks
          ? JSON.stringify(data.syncedBanks)
          : undefined,
        blackListedBanks: data.blackListedBanks
          ? JSON.stringify(data.blackListedBanks)
          : undefined,
        minAmountAllowed: data.minAmountAllowed,
        maxAmountAllowed: data.maxAmountAllowed,
        requireManualConfirmation: data.requireManualConfirmation,
        dailyCap: data.dailyCap,
        isActive: data.isActive,
        default: data.default,
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

  setAdminDefaultBankAccount: async (
    bankAccountId: string,
    previousDefaultBankAccountId?: string,
  ) => {
    if (bankAccountId === previousDefaultBankAccountId) return;

    if (previousDefaultBankAccountId) {
      await prisma.adminBankAccount.update({
        where: { id: previousDefaultBankAccountId },
        data: { default: false },
      });
    }

    await prisma.adminBankAccount.update({
      where: { id: bankAccountId },
      data: { default: true },
    });
  },

  deactivateAdminBankAccount: async (bankAccountId: string) => {
    return await prisma.adminBankAccount.update({
      where: { id: bankAccountId },
      data: { isActive: false },
    });
  },

  activateAdminBankAccount: async (bankAccountId: string) => {
    return await prisma.adminBankAccount.update({
      where: { id: bankAccountId },
      data: { isActive: true },
    });
  },

  deleteAdminBankAccount: async (bankAccountId: string) => {
    return await prisma.adminBankAccount.delete({
      where: { id: bankAccountId },
    });
  },
};
