import type { AdminBankAccount } from "@/prisma/lib/generated/prisma/client";
import { BankAccountSelector, pickRandom } from "./utils";

type AssignBankParams = {
  adminAcc: AdminBankAccount[];
  clientBankCode: string;
  clientTotalTransactions: number;
  nairaAmountToFund: number;
};

const getAdminDefaultAccount = (
  accounts: AdminBankAccount[],
): AdminBankAccount | null =>
  accounts.find((acc) => acc.default === true) ?? null;

const getSameBankAccount = (
  accounts: AdminBankAccount[],
  clientBankCode: string,
): AdminBankAccount | null =>
  accounts.find((acc) => acc.bankCode === clientBankCode) ?? null;

const getSyncedBankAccounts = (
  accounts: AdminBankAccount[],
  clientBankCode: string,
): AdminBankAccount[] =>
  accounts.filter((acc) => acc.syncedBanks.includes(clientBankCode));

export const assignDepositBankAccount = ({
  adminAcc,
  clientBankCode,
  clientTotalTransactions,
  nairaAmountToFund,
}: AssignBankParams): AdminBankAccount | null => {
  const eligibleAccounts = new BankAccountSelector(adminAcc)
    .withoutBlacklisted(clientBankCode)
    .withinAmountRange(nairaAmountToFund).value;

  if (eligibleAccounts.length === 0) return null;

  // New client → prefer admin default
  if (clientTotalTransactions === 0) {
    const defaultAccount = getAdminDefaultAccount(eligibleAccounts);
    if (defaultAccount) return defaultAccount;
  }

  // Prefer same-bank transfers
  const sameBankAccount = getSameBankAccount(eligibleAccounts, clientBankCode);
  if (sameBankAccount) return sameBankAccount;

  // Prefer synced banks
  const syncedBanks = getSyncedBankAccounts(eligibleAccounts, clientBankCode);
  const randomSyncedBank = pickRandom(syncedBanks);
  if (randomSyncedBank) return randomSyncedBank;

  // Final fallback
  return pickRandom(eligibleAccounts);
};
