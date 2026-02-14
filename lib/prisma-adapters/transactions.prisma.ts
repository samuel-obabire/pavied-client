import type { TransactionQueryParams } from "@/lib/actions/types/action";
import { PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { transformDecimals } from "./utils";

export const transactionsAdapter = {
  getTransactionById: async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { transactionId },
      include: {
        // user: { select: { id: true } },
        derivDepositExtra: true,
        derivWithdrawalExtra: true,
      },
    });

    return transformDecimals(transaction);
  },

  getUserTransactions: async (
    userId: string,
    query: TransactionQueryParams,
  ) => {
    const {
      page = 1,
      perPage = PER_PAGE,
      startDate,
      endDate,
      status,
      type,
    } = query;

    const where: any = { userId };

    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...(where.createdAt ?? {}), lte: new Date(endDate) };
    if (status) where.status = status;
    if (type) where.type = type;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return transformDecimals(transactions);
  },
};
