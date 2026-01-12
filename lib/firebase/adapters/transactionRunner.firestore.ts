import {
  type Transaction as FirestoreTransaction,
  Timestamp,
} from "firebase-admin/firestore";
import { db } from "@/firebase.config";
import { DbCollections } from "@/lib/constants/dbCollections";
import type { DbTransaction } from "../firestore.transactions";

const bankDocId = (bankCode: string, accountNumber: string) =>
  `${bankCode}_${accountNumber}`;

const derivDocId = (currency: string, accountId: string) =>
  `${currency}_${accountId}`;

export const runFirestoreTransaction = async <T>(
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> =>
  db.runTransaction(async (fireTx: FirestoreTransaction) => {
    const tx: DbTransaction = {
      async getBankAccount(bankCode, accountNumber) {
        const snap = await fireTx.get(
          db
            .collection(DbCollections.BANK_ACCOUNTS)
            .doc(bankDocId(bankCode, accountNumber)),
        );
        return snap.exists ? (snap.data() as BankAccount) : null;
      },

      async addBankAccount(bankAccount, userId) {
        fireTx.set(
          db
            .collection(DbCollections.BANK_ACCOUNTS)
            .doc(bankDocId(bankAccount.bankCode, bankAccount.accountNumber)),
          {
            ...bankAccount,
            userId,
            dateAdded: Timestamp.now(),
          },
        );
      },

      async getDerivAccount({ currency, accountId }) {
        const snap = await fireTx.get(
          db
            .collection(DbCollections.DERIV_ACCOUNTS)
            .doc(derivDocId(currency, accountId)),
        );
        return snap.exists ? (snap.data() as DerivAccount) : null;
      },

      async addDerivAccount(derivAccount, userId) {
        fireTx.set(
          db
            .collection(DbCollections.DERIV_ACCOUNTS)
            .doc(derivDocId(derivAccount.currency, derivAccount.accountId)),
          {
            ...derivAccount,
            userId,
            dateAdded: Timestamp.now(),
          },
        );
      },

      async getTransaction(transactionId) {
        const ref = db
          .collection(DbCollections.TRANSACTIONS)
          .doc(transactionId);

        const snap = await fireTx.get(ref);
        return snap.exists ? (snap.data() as Transaction) : null;
      },

      async updateTransaction(transactionId, data) {
        fireTx.update(
          db.collection(DbCollections.TRANSACTIONS).doc(transactionId),
          {
            ...data,
            updatedAt: Timestamp.now(),
          },
        );
      },
    };

    return fn(tx);
  });
