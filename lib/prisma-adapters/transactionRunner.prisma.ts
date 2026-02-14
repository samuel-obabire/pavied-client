import prisma from "@/lib/prisma";
import type {
  BankAccount,
  DerivAccount,
  Transaction,
  TransactionStatus,
} from "@/prisma/lib/generated/prisma/client";

export interface DbTransaction {
  getBankAccount(
    bankCode: string,
    accountNumber: string,
  ): Promise<BankAccount | null>;

  addBankAccount(bankAccount: BankAccount, userId: string): Promise<void>;

  getDerivAccount(account: {
    currency: string;
    accountId: string;
  }): Promise<DerivAccount | null>;

  addDerivAccount(derivAccount: DerivAccount, userId: string): Promise<void>;
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
      async getBankAccount(bankCode, accountNumber) {
        return await px.bankAccount.findFirst({
          where: {
            bankCode,
            accountNumber,
          },
        });
      },

      async addBankAccount(bankAccount, userId) {
        await px.bankAccount.create({
          data: {
            accountName: bankAccount.accountName,
            accountNumber: bankAccount.accountNumber,
            bankName: bankAccount.bankName,
            bankCode: bankAccount.bankCode,
            active: bankAccount.active,
            user: {
              connect: { id: userId },
            },
          },
        });
      },

      async getDerivAccount({ currency, accountId }) {
        return await px.derivAccount.findFirst({
          where: {
            currency,
            accountId,
          },
        });
      },

      async addDerivAccount(derivAccount, userId) {
        await px.derivAccount.create({
          data: {
            accountId: derivAccount.accountId,
            currency: derivAccount.currency,
            active: derivAccount.active,
            token: derivAccount.token,
            user: {
              connect: { id: userId },
            },
          },
        });
      },

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
