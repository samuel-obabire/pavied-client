import prisma from "@/lib/prisma";

export const derivAdapter = {
  removeDerivAccount: async ({ currency, accountId }: DerivAccount) => {
    await prisma.derivAccount.deleteMany({
      where: {
        currency,
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
    });

    if (!withToken) {
      return accounts.map(({ token, ...rest }) => ({
        ...rest,
        dateAdded: rest.dateAdded,
      })) as DerivAccount[];
    }

    return accounts as DerivAccount[];
  },

  getAgentAccount: async (currency: string) => {
    const account = await prisma.agentDerivAccount.findUnique({
      where: { currency },
    });

    if (!account) return null;

    return {
      accountId: account.accountId,
      currency: account.currency,
      active: account.active,
      token: account.token,
      dateAdded: account.createdAt,
    } as DerivAccount;
  },
};
