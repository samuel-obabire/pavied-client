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

export const getDerivAccounts = async (userId: string, onlyActive: boolean) => {
  let queryRef = db
    .collection(DbCollections.DERIV_ACCOUNTS)
    .where("userId", "==", userId)
    .withConverter(dateConverter);

  if (onlyActive) {
    queryRef = queryRef.where("active", "==", true);
  }
  const snap = await queryRef.get();

  if (snap.empty) return [];

  const derivAccounts = snap.docs
    .map((doc) => doc.data() as DerivAccount)
    .map((acc: DerivAccount) => {
      const modifiedAccount = acc;

      delete modifiedAccount.token;
      return modifiedAccount;
    });

  return derivAccounts;
};

export const getAgentAccount = async (currency: string) => {
  const derivAccount = await getById<DerivAccount>(
    DbCollections.AGENT_ACCOUNTS,
    currency,
  );

  return derivAccount;
};
