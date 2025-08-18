import { getById, queryWhere, setById } from "./firestore";

export const getUserById = async (userId: string) => {
  return await getById<User>("users", userId);
};

export const getUserByEmail = async (email: string) => {
  const result = await queryWhere<User, "==", string>(
    "users",
    "email",
    "==",
    email
  );

  const user = result ? result[0] : null;
  return user;
};

export const createUser = async <T>(userId: string, userData: T) => {
  await setById("users", userId, userData);
};
