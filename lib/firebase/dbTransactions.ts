import { Timestamp } from "firebase-admin/firestore";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";
import { DbCollections } from "../constants/dbCollections";

export const addBankAccountTransaction = async (
  accountNumber: string,
  bankCode: string,
  bankAccount: BankAccount,
) => {
  const bankAccountRef = db
    .collection("bank-accounts")
    .doc(`${bankCode}_${accountNumber}`);

  await db.runTransaction(async (t) => {
    const res = await t.get(bankAccountRef);

    if (res.exists) throw new Error("Account already exist in the database");

    t.set(bankAccountRef, { ...bankAccount, dateAdded: Timestamp.now() });
  });
};

export const addDerivAccountTransaction = async (
  derivAccounts: DerivAccountLink[],
  userId: string,
) => {
  await db.runTransaction(async (t) => {
    for (const account of derivAccounts) {
      const accountRef = db
        .collection(DbCollections.DERIV_ACCOUNTS)
        .doc(`${account.currency}_${account.accountId}`);

      const doc = await t.get(accountRef);

      if (doc.exists) {
        const data = doc.data() as DerivAccount;

        if (data.userId !== userId) {
          throw new Error(
            `Account ${account.accountId} already exist in database with another user`,
          );
        }
      }
    }

    derivAccounts.forEach((account) => {
      const accountRef = db
        .collection(DbCollections.DERIV_ACCOUNTS)
        .doc(`${account.currency}_${account.accountId}`);

      t.set(accountRef, { ...account, userId, dateAdded: Timestamp.now() });
    });
  });
};
