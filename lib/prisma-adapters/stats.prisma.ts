import prisma from "@/lib/prisma";
import { transformDecimals } from "./utils";

export const statsAdapter = {
  getUserStats: async (userId: string) => {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    return transformDecimals(stats);
  },
};
