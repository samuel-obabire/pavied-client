/* eslint-disable @stylistic/brace-style */
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
          referralEarnings: 0,
          onboardingStep: "bio",
          referralCount: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          phone: "",
          whatsApp: "",
        } satisfies User;

        const { success } = await api.users.create(newUser);

        return !!success;
      }
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.onboardingStep = token.onboardingStep as OnboardingStep;
      return session;
    },

    async jwt({ token, user, trigger }) {
      // Handle first sign in
      if (user?.email) {
        const { success, data: dbUser } = await api.users.getByEmail(
          user.email.toLowerCase()
        );

        if (success && dbUser) {
          token.id = dbUser.id;
          token.onboardingStep = dbUser.onboardingStep;
        } else {
          token.id = null;
        }
      }

      // Handle explicit updates
      else if (trigger === "update" && token.id) {
        const { success, data: dbUser } = await api.users.getById(
          token.id as string
        );

        if (success && dbUser) {
          token.id = dbUser.id;
          token.onboardingStep = dbUser.onboardingStep;
        } else {
          token.id = null;
        }
      }

      return token;
    },
  },
});
