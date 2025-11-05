import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { DbCollections } from "../constants/dbCollections";
import { addDerivAccountTransaction } from "./dbTransactions";
import { deleteById, getById, queryWhere } from "./firestore";

export const addDerivAccountsToCollection = async (
  derivAccounts: DerivAccountLink[],
  userId: string,
) => {
  await addDerivAccountTransaction(derivAccounts, userId);
};

export const removeDerivAccountFromCollection = async (
  derivAccount: DerivAccount,
) => {
  const { accountId, currency } = derivAccount;
  await deleteById(DbCollections.DERIV_ACCOUNTS, `${currency}_${accountId}`);
};

export const getDerivAccounts = async (userId: string) => {
  const derivAccounts = await queryWhere<DerivAccount, "==">(
    DbCollections.DERIV_ACCOUNTS,
    "userId",
    "==",
    userId,
  );

  return derivAccounts;
};

export const getAgentAccount = async (currency: string) => {
  const derivAccount = await getById<DerivAccount>(
    "agent-deriv-accounts",
    currency,
  );

  return derivAccount;
};
