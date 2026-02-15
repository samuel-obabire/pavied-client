import prisma from "@/lib/prisma";

export const derivAdapter = {
  removeDerivAccount: async (accountId: string) => {
    await prisma.derivAccount.deleteMany({
      where: {
        accountId,
      },
    });
  },

  getDerivAccounts: async (
    userId: string,
    options: { onlyActive?: boolean; withToken?: boolean } = {},
  ) => {
    const { onlyActive = false, withToken = false } = options;

    const accounts = await prisma.derivAccount.findMany({
      where: {
        userId,
        ...(onlyActive && { active: true }),
      },
      omit: {
        ...(!withToken && { token: true }),
      },
    });

    return accounts;
  },

  getAgentAccount: async (currency: string) => {
    const account = await prisma.agentDerivAccount.findUnique({
      where: { currency },
    });

    return account;
  },
};
