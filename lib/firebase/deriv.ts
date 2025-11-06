import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";
import { DbCollections } from "../constants/dbCollections";
import { dateConverter } from "../utils/firebase";
import { addDerivAccountTransaction } from "./dbTransactions";
import { deleteById, getById } from "./firestore";

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

export const getDerivAccounts = async (
  userId: string,
  options: { onlyActive?: boolean; withToken?: boolean } = {},
) => {
  const { onlyActive = false, withToken = false } = options;

  let queryRef = db
    .collection(DbCollections.DERIV_ACCOUNTS)
    .where("userId", "==", userId)
    .withConverter(dateConverter);

  if (onlyActive) {
    queryRef = queryRef.where("active", "==", true);
  }

  const snap = await queryRef.get();
  if (snap.empty) return [];

  const accounts = snap.docs.map((doc) => doc.data() as DerivAccount);

  if (withToken) return accounts;

  return accounts.map(({ token, ...rest }) => rest);
};

export const getAgentAccount = async (currency: string) => {
  const derivAccount = await getById<DerivAccount>(
    DbCollections.AGENT_ACCOUNTS,
    currency,
  );

  return derivAccount;
};
