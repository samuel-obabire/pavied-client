import { addBankAccountTransaction } from "./dbTransactions";
import { deleteById, queryWhere } from "./firestore";
import { DbCollections } from "../constants/dbCollections";

export const addBankAcccountToCollection = async (bankAccount: BankAccount) => {
  const { bankCode, accountNumber } = bankAccount;
  await addBankAccountTransaction(accountNumber, bankCode, bankAccount);
};

export const removeBankAccountFromCollection = async (
  bankAccount: BankAccount
) => {
  const { accountNumber, bankCode } = bankAccount;
  await deleteById(DbCollections.BANK_ACCOUNTS, `${bankCode}_${accountNumber}`);
};

export const getBankAccounts = async (userId: string) => {
  const bankAccounts = await queryWhere<BankAccount, "==">(
    DbCollections.BANK_ACCOUNTS,
    "userId",
    "==",
    userId
  );

  return bankAccounts;
};
