import prisma from "@/lib/prisma";
import type {
  Transaction,
  TransactionStatus,
} from "@/prisma/lib/generated/prisma/client";

export interface DbTransaction {
  getTransaction(transactionId: string): Promise<Transaction | null>;

  updateDerivDepositTransactionRecieptPath(
    transactionId: string,
    recieptPath: string,
  ): Promise<void>;

  updateTransactionStatus(
    transactionId: string,
    status: Extract<TransactionStatus, "PROCESSING">,
  ): Promise<void>;
}

export const runPrismaTransaction = async <T>(
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> => {
  return await prisma.$transaction(async (px) => {
    const tx: DbTransaction = {
      async getTransaction(transactionId) {
        return await px.transaction.findUnique({
          where: { transactionId },
        });
      },

      async updateDerivDepositTransactionRecieptPath(
        transactionId,
        recieptPath,
      ): Promise<void> {
        await px.derivDepositExtra.update({
          where: { transactionId },
          data: {
            recieptPath,
          },
        });
      },

      async updateTransactionStatus(transactionId, status): Promise<void> {
        await px.transaction.update({
          where: { transactionId },
          data: {
            status,
          },
        });
      },
    };

    return fn(tx);
  });
};
