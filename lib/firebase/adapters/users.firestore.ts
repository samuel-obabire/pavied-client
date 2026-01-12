import { DbCollections } from "@/lib/constants/dbCollections";
import { getById, queryWhere, setById, updateByid } from "../firestore";

export const usersFirestore = {
  createUser: async <T>(userId: string, userData: T) =>
    setById(DbCollections.USERS, userId, userData),

  updateUserById: async (userId: string, userData: Partial<User>) =>
    updateByid(DbCollections.USERS, userId, userData),

  getUserById: async (userId: string) =>
    getById<User>(DbCollections.USERS, userId),

  getUserByEmail: async (email: string) => {
    const users = await queryWhere<User, "==">(
      DbCollections.USERS,
      "email",
      "==",
      email,
    );
    return users[0] ?? null;
  },
};
