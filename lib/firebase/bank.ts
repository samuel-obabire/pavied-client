import { db } from "@/firebase.config";
import { DbCollections } from "../constants/dbCollections";
import { dateConverter } from "../utils/firebase";
import { addBankAccountTransaction } from "./dbTransactions";
import { deleteById } from "./firestore";

export const addBankAcccountToCollection = async (bankAccount: BankAccount) => {
  const { bankCode, accountNumber } = bankAccount;
  await addBankAccountTransaction(accountNumber, bankCode, bankAccount);
};

export const removeBankAccountFromCollection = async (
  bankAccount: BankAccount,
) => {
  const { accountNumber, bankCode } = bankAccount;
  await deleteById(DbCollections.BANK_ACCOUNTS, `${bankCode}_${accountNumber}`);
};

export const getBankAccounts = async (userId: string, onlyActive: boolean) => {
  let queryRef = db
    .collection(DbCollections.BANK_ACCOUNTS)
    .where("userId", "==", userId)
    .withConverter(dateConverter);

  if (onlyActive) {
    queryRef = queryRef.where("active", "==", true);
  }

  const snap = await queryRef.get();
  if (snap.empty) return [];

  const bankAccounts = snap.docs.map((doc) => doc.data() as BankAccount);

  return bankAccounts;
};
