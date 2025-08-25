import { DbCollections } from "../constants";
import {
  addbankAccount,
  addDerivAccount,
  deleteById,
  getById,
  queryWhere,
  setById,
  updateByid,
} from "./firestore";

export const getUserById = async (userId: string) => {
  return await getById<User>("users", userId);
};

export const getUserByEmail = async (email: string) => {
  const result = await queryWhere<User, "==">("users", "email", "==", email);

  const user = result ? result[0] : null;
  return user;
};

export const getUserDerivAccounts = async (userId: string) => {
  const derivAccounts = await queryWhere<DerivAccount, "==">(
    DbCollections.DERIV_ACCOUNTS,
    "userId",
    "==",
    userId
  );

  return derivAccounts;
};

export const getUserBankAccounts = async (userId: string) => {
  const bankAccounts = await queryWhere<BankAccount, "==">(
    DbCollections.BANK_ACCOUNTS,
    "userId",
    "==",
    userId
  );

  return bankAccounts;
};

export const createUser = async <T>(userId: string, userData: T) => {
  await setById("users", userId, userData);
};

export const updateUserById = async (
  userId: string,
  userData: Partial<User>
) => {
  await updateByid("users", userId, userData);
};

export const addUserBankAcccountToCollection = async (
  bankAccount: BankAccount
) => {
  const { bankCode, accountNumber } = bankAccount;
  await addbankAccount(accountNumber, bankCode, {
    ...bankAccount,
    dateAdded: Date.now(),
  });
};

export const addUserDerivAccountToCollection = async (
  derivAccount: DerivAccount
) => {
  const { accountId, currency } = derivAccount;
  await addDerivAccount(accountId, currency, {
    ...derivAccount,
    dateAdded: Date.now(),
  });
};

export const removeUserDerivAccountFromCollection = async (
  derivAccount: DerivAccount
) => {
  const { accountId, currency } = derivAccount;
  await deleteById(DbCollections.DERIV_ACCOUNTS, `${currency}_${accountId}`);
};

export const removeUserBankAccountFromCollection = async (
  bankAccount: BankAccount
) => {
  const { accountNumber, bankCode } = bankAccount;
  await deleteById(DbCollections.BANK_ACCOUNTS, `${bankCode}_${accountNumber}`);
};
