/* eslint-disable @stylistic/brace-style */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ENV } from "./lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      const { provider, providerAccountId } = account;

      if (!providerAccountId) return false;

      const { success } = (await api.users.getByEmail(
        user.email.toLowerCase(),
      )) as ActionResponse<User>;

      if (success) {
        return true;

        // biome-ignore lint/style/noUselessElse: allow else clause
      } else {
        const newUser = {
          telegramId: "",
          email: user.email.toLowerCase(),
          id: providerAccountId,
          provider,
          providerAccountId,
          fullName: "",
          onboardingStep: "bio",
          createdAt: new Date(),
          updatedAt: new Date(),
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
      session.user.name = token.name as string;
      return session;
    },

    async jwt({ token, user, trigger }) {
      // Handle first sign in
      if (user?.email) {
        const { success, data: dbUser } = await api.users.getByEmail(
          user.email.toLowerCase(),
        );

        if (success && dbUser) {
          token.id = dbUser.id;
          token.onboardingStep = dbUser.onboardingStep;
          token.name = dbUser.fullName;
        } else {
          token.id = null;
        }
      }

      // Handle explicit updates
      else if (trigger === "update" && token.id) {
        const { success, data: dbUser } = await api.users.getById(
          token.id as string,
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
