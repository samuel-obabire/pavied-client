import { DbCollections } from "@/lib/constants/dbCollections";
import { getById } from "../firestore";

export const statsFirestore = {
  getUserStats: async (userId: string) =>
    getById<UserStats>(DbCollections.USER_STATS, userId),
};
