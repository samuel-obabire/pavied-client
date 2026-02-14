import prisma from "@/lib/prisma";

export const statsAdapter = {
  getUserStats: async (userId: string) => {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) return null;

    return {
      userId: stats.userId,
      totalTransactions: stats.totalTransactions,
      totalDeposits: Number(stats.totalDeposits),
      totalWithdrawals: Number(stats.totalWithdrawals),
      totalSuccessfulTransactions: stats.totalSuccessfulTransactions,
      totalFailedTransactions: stats.totalFailedTransactions,
      createdAt: stats.createdAt,
      updatedAt: stats.updatedAt,
    } as UserStats;
  },
};
