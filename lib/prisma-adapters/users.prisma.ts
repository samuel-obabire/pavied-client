import prisma from "@/lib/prisma";
import type { UserUpdateInput } from "@/prisma/lib/generated/prisma/models";

export const usersAdapter = {
  updateUserById: async (userId: string, userData: UserUpdateInput) => {
    return await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  },

  getUserById: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },

  getUserByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
};
