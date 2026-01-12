import { bankFirestore } from "./adapters/bank.firestore";
import { derivFirestore } from "./adapters/deriv.firestore";
import { ratesFirestore } from "./adapters/rates.firestore";
import { runFirestoreTransaction } from "./adapters/transactionRunner.firestore";
import { transactionsFirestore } from "./adapters/transactions.firestore";
import { usersFirestore } from "./adapters/users.firestore";

export const firestoreAdapter = {
  user: usersFirestore,
  transactions: transactionsFirestore,
  deriv: derivFirestore,
  bank: bankFirestore,
  rates: ratesFirestore,
  runTransaction: runFirestoreTransaction,
};
