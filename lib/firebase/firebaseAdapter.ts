import { DbCollections } from "../constants/dbCollections";
import { getById, queryWhere, setById, updateByid } from "./firestore";

export const db = {
  user: {
    createUser: async <T>(userId: string, userData: T) => {
      await setById("users", userId, userData);
    },
    updateUserById: async (userId: string, userData: Partial<User>) => {
      await updateByid("users", userId, userData);
    },
    getUserById: async (adminId: string) => {
      return getById<User>(DbCollections.USERS, adminId);
    },
    getUserByEmail: async (email: string) => {
      const user = await queryWhere<User, "==">(
        DbCollections.USERS,
        "email",
        "==",
        email,
      );

      return user[0] ? user[0] : null;
    },
  },
  transactions: {
    getTransactionById: async (transactionId: string) => {
      return await getById<Transaction>("transactions", transactionId);
    },
  },
};
