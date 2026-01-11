import {
  type Transaction as FirebaseTransaction,
  Timestamp,
} from "firebase-admin/firestore";
import type { DerivAccountLink } from "@/components/DerivAccountSelectionList";
import { db } from "@/firebase.config";
import { DbCollections } from "../constants/dbCollections";

type TransactionContext = {
  addBankAccount: (bankAccount: BankAccount, userId: string) => Promise<void>;
  addDerivAccount: (
    derivAccount: DerivAccountLink,
    userId: string,
  ) => Promise<void>;
  getBankAccount: (
    bankCode: string,
    accountNumber: string,
  ) => Promise<BankAccount | null>;
  getDerivAccount: (
    derivAccount: Omit<DerivAccountLink, "token">,
  ) => Promise<DerivAccount | null>;
};

export const fireStoreAdapter = {
  async runTransaction(fn: (tx: TransactionContext) => void) {
    return await db.runTransaction(async (fireTx: FirebaseTransaction) => {
      const ctx: TransactionContext = {
        getBankAccount: async (bankCode, accountNumber) => {
          const txRef = db
            .collection(DbCollections.BANK_ACCOUNTS)
            .doc(`${bankCode}_${accountNumber}`);

          const snap = await fireTx.get(txRef);
          return snap.exists ? (snap.data() as BankAccount) : null;
        },

        addBankAccount: async (bankAccount, userId) => {
          const txRef = db
            .collection(DbCollections.BANK_ACCOUNTS)
            .doc(`${bankAccount.bankCode}_${bankAccount.accountNumber}`);

          fireTx.set(txRef, {
            ...bankAccount,
            userId,
            dateAdded: Timestamp.now(),
          });
        },

        getDerivAccount: async (derivAccount) => {
          const txRef = db
            .collection(DbCollections.DERIV_ACCOUNTS)
            .doc(`${derivAccount.currency}_${derivAccount.accountId}`);

          const snap = await fireTx.get(txRef);
          return snap.exists ? (snap.data() as DerivAccount) : null;
        },

        addDerivAccount: async (derivAccount, userId) => {
          const accountRef = db
            .collection(DbCollections.DERIV_ACCOUNTS)
            .doc(`${derivAccount.currency}_${derivAccount.accountId}`);

          fireTx.set(accountRef, {
            ...derivAccount,
            userId,
            dateAdded: Timestamp.now(),
          });
        },
      };

      return fn(ctx);
    });
  },
};
