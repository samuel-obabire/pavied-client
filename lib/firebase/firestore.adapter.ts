import { adminBankAdapter } from "../prisma-adapters/adminBank.prisma";
import { bankAdapter } from "../prisma-adapters/bank.prisma";
import { derivAdapter } from "../prisma-adapters/deriv.prisma";
import { ratesAdapter } from "../prisma-adapters/rates.prisma";
import { siteConfigAdapter } from "../prisma-adapters/siteConfig.prisma";
import { statsAdapter } from "../prisma-adapters/stats.prisma";
import { runPrismaTransaction } from "../prisma-adapters/transactionRunner.prisma";
import { transactionsAdapter } from "../prisma-adapters/transactions.prisma";
import { usersAdapter } from "../prisma-adapters/users.prisma";

export const firestoreAdapter = {
  user: usersAdapter,
  stats: statsAdapter,
  transactions: transactionsAdapter,
  deriv: derivAdapter,
  bank: bankAdapter,
  adminBank: adminBankAdapter,
  rates: ratesAdapter,
  siteConfig: siteConfigAdapter,
  runTransaction: runPrismaTransaction,
};
