import { adminBankFirestore } from "./adapters/adminBank.firestore";
import { bankFirestore } from "./adapters/bank.firestore";
import { derivFirestore } from "./adapters/deriv.firestore";
import { ratesFirestore } from "./adapters/rates.firestore";
import { statsFirestore } from "./adapters/stats.firestore";
import { runFirestoreTransaction } from "./adapters/transactionRunner.firestore";
import { transactionsFirestore } from "./adapters/transactions.firestore";
import { usersFirestore } from "./adapters/users.firestore";
import { siteConfigStore } from "./siteConfig";

export const firestoreAdapter = {
  user: usersFirestore,
  stats: statsFirestore,
  transactions: transactionsFirestore,
  deriv: derivFirestore,
  bank: bankFirestore,
  adminBank: adminBankFirestore,
  rates: ratesFirestore,
  siteConfig: siteConfigStore,
  runTransaction: runFirestoreTransaction,
};
