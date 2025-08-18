import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { api } from "./lib/api";
import logger from "./lib/logger";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) {
        throw new Error("Missing login parameters");
      }

      const { provider, providerAccountId } = account;

      if (!providerAccountId) return false;

      const { success } = (await api.users.getByEmail(
        user.email.toLowerCase()
      )) as ActionResponse<User>;

      if (success) {
        return true;
      } else {
        // Get the new user telegram id
        const cookieStore = await cookies();

        const tgid = cookieStore.get("tgid");
        if (!tgid) {
          logger.error("Create account blocked - No tgid");
          return false;
        }

        const newUser = {
          telegramId: tgid.value,
          email: user.email.toLowerCase(),
          id: providerAccountId,
          provider,
          providerAccountId,
          fullName: "",
          bankAccounts: [],
          derivAccounts: [],
          referralCode: "",
          referredBy: "",
          referralEarning: 0,
          referralCount: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const { success } = (await api.users.create(newUser)) as ActionResponse;

        return !!success;
      }
    },

    async session({ session }) {
      try {
        const { success, data: user } = await api.users.getByEmail(
          session.user.email
        );

        if (!success || !user) return session;

        session.user.id = user.id;
        session.user.telegramId = user.telegramId;
        session.user.fullName = user.fullName;
      } catch (error) {
        logger.error(error);
      }
      return session;
    },
  },
});
