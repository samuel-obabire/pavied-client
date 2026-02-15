import { adminBankAdapter } from "./adminBank.prisma";
import { bankAdapter } from "./bank.prisma";
import { derivAdapter } from "./deriv.prisma";
import { derivFlowAdapter } from "./derivFlow.prisma";
import { ratesAdapter } from "./rates.prisma";
import { siteConfigAdapter } from "./siteConfig.prisma";
import { statsAdapter } from "./stats.prisma";
import { runPrismaTransaction } from "./transactionRunner.prisma";
import { transactionsAdapter } from "./transactions.prisma";
import { usersAdapter } from "./users.prisma";

export const prismaAdapter = {
  user: usersAdapter,
  stats: statsAdapter,
  transactions: transactionsAdapter,
  deriv: derivAdapter,
  derivFlow: derivFlowAdapter,
  bank: bankAdapter,
  adminBank: adminBankAdapter,
  rates: ratesAdapter,
  siteConfig: siteConfigAdapter,
  runDbTransaction: runPrismaTransaction,
};
