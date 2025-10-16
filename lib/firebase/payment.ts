import { getById } from "./firestore";

export const getTransactionById = async (transactionId: string) => {
  return await getById<Transaction>("transactions", transactionId);
};
