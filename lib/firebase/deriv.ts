import { DerivAccountLink } from "@/components/DerivAccountSelectionList";

import { addDerivAccountTransaction } from "./dbTransactions";
import { deleteById, queryWhere } from "./firestore";
import { DbCollections } from "../constants/dbCollections";

export const addDerivAccountsToCollection = async (
  derivAccounts: DerivAccountLink[],
  userId: string
) => {
  await addDerivAccountTransaction(derivAccounts, userId);
};

export const removeDerivAccountFromCollection = async (
  derivAccount: DerivAccount
) => {
  const { accountId, currency } = derivAccount;
  await deleteById(DbCollections.DERIV_ACCOUNTS, `${currency}_${accountId}`);
};

export const getDerivAccounts = async (userId: string) => {
  const derivAccounts = await queryWhere<DerivAccount, "==">(
    DbCollections.DERIV_ACCOUNTS,
    "userId",
    "==",
    userId
  );

  return derivAccounts;
};
