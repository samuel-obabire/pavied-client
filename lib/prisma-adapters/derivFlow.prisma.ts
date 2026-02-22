import prisma from "@/lib/prisma";

type DerivAccountUpsertInput = {
  accountId: string;
  currency: string;
  token: string;
};

type CreateDerivDepositTransactionInput = {
  userId: string;
  amount: number;
  convertedAmount: number;
  currency: string;
  derivLoginId: string;
  paidFromBankName: string;
  paidFromBankCode: string;
  paidFromAccountNumber: string;
  paidFromAccountName: string;
  assignedBankId: string;
  assignedBankName: string;
  assignedBankAccountName: string;
  assignedBankAccountNumber: string;
  transactionId: string;
};

type CreateDerivWithdrawalTransactionInput = {
  userId: string;
  transactionId: string;
  amount: number;
  convertedAmount: number;
  currency: string;
  derivLoginId: string;
  receivingBankAccountNumber: string;
  receivingBankCode: string;
  receivingBankName: string;
  recievingBankAccountName: string;
};

export const derivFlowAdapter = {
  syncUserDerivAccounts: async (
    userId: string,
    accounts: DerivAccountUpsertInput[],
  ) => {
    await prisma.$transaction(async (tx) => {
      const accountIds = accounts.map((account) => account.accountId);

      const [existingAccounts, totalAccRecords] = await Promise.all([
        tx.derivAccount.findMany({
          where: { accountId: { in: accountIds } },
          select: { accountId: true, userId: true },
        }),
        tx.derivAccount.count({
          where: { userId },
        }),
      ]);

      for (const existing of existingAccounts) {
        if (existing.userId !== userId) {
          throw new Error(
            `Account ${existing.accountId} belongs to another user`,
          );
        }
      }

      const ownedExistingAccounts = existingAccounts.filter(
        (account) => account.userId === userId,
      );

      const newAccountsCount = accounts.length - ownedExistingAccounts.length;

      if (totalAccRecords + newAccountsCount > 10) {
        throw new Error(
          "You have reached the maximum accounts you can add (10)",
        );
      }

      for (const account of accounts) {
        await tx.derivAccount.upsert({
          where: { accountId: account.accountId },
          update: { token: account.token },
          create: {
            ...account,
            active: false,
            user: { connect: { id: userId } },
          },
        });
      }
    });
  },

  createDerivDepositTransaction: async (
    input: CreateDerivDepositTransactionInput,
  ) => {
    return await prisma.$transaction(async (tx) => {
      const pendingUserOrder = await tx.transaction.findFirst({
        where: {
          userId: input.userId,
          status: { in: ["PENDING", "PROCESSING"] },
          type: "DERIV_DEPOSIT",
        },
      });

      if (pendingUserOrder) {
        throw new Error(
          "You have a pending order. Please create a new order when your pending order has expired or completed",
        );
      }

      const similarOrder = await tx.transaction.findFirst({
        where: {
          status: { in: ["PENDING", "PROCESSING"] },
          type: "DERIV_DEPOSIT",
          derivDepositExtra: {
            is: {
              paidFromAccountName: input.paidFromAccountName,
            },
          },
        },
      });

      if (similarOrder) {
        throw new Error(
          "Unable to complete your request. Please try again in few minutes",
        );
      }

      const transaction = await tx.transaction.create({
        data: {
          transactionId: input.transactionId,
          amount: input.amount,
          status: "PENDING",
          type: "DERIV_DEPOSIT",
          fulfillmentFulfilled: false,
          derivDepositExtra: {
            create: {
              currency: input.currency,
              amount: input.convertedAmount,
              derivLoginId: input.derivLoginId,
              paidFromBankName: input.paidFromBankName,
              paidFromBankCode: input.paidFromBankCode,
              paidFromAccountNumber: input.paidFromAccountNumber,
              paidFromAccountName: input.paidFromAccountName,
              assignedBankId: input.assignedBankId,
              assignedBankName: input.assignedBankName,
              assignedBankAccountName: input.assignedBankAccountName,
              assignedBankAccountNumber: input.assignedBankAccountNumber,
            },
          },
          user: { connect: { id: input.userId } },
        },
      });

      return transaction.transactionId;
    });
  },

  createDerivWithdrawalTransaction: async (
    input: CreateDerivWithdrawalTransactionInput,
  ) => {
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: input.transactionId,
        amount: input.convertedAmount,
        type: "DERIV_WITHDRAWAL",
        user: { connect: { id: input.userId } },
        derivWithdrawalExtra: {
          create: {
            amount: input.amount,
            currency: input.currency,
            derivLoginId: input.derivLoginId,
            receivingBankAccountNumber: input.receivingBankAccountNumber,
            receivingBankCode: input.receivingBankCode,
            receivingBankName: input.receivingBankName,
            recievingBankAccountName: input.recievingBankAccountName,
          },
        },
      },
      select: {
        transactionId: true,
      },
    });

    return transaction.transactionId;
  },
};
