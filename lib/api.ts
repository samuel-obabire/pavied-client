import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  users: {
    getById: async (id: string) => {
      return await fetchHandler(`${API_BASE_URL}/users/${id}`);
    },
    getByEmail: async (email: string) => {
      return await fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    create: async (userData: Partial<User>) => {
      return await fetchHandler(`${API_BASE_URL}/users/${userData.id}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  },
};
