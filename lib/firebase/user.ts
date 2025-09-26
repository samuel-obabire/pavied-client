import { getById, queryWhere, setById, updateByid } from "./firestore";

export const getUserById = async (userId: string) => {
  return await getById<User>("users", userId);
};

export const getUserByEmail = async (email: string) => {
  const result = await queryWhere<User, "==">("users", "email", "==", email);

  const user = result ? result[0] : null;
  return user;
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
