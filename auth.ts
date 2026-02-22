import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";
import {
  sendEmailVerification,
  sendPasswordResetVerification,
} from "./lib/resend";
import { OnboardingStep, Role } from "./prisma/lib/generated/prisma/enums";

const NEXT_PUBLIC_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_URL;

export const auth = betterAuth({
  appName: "Pavied",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      onboardingStep: {
        type: "string",
        defaultValue: OnboardingStep.BIO,
        input: false,
        map: (value: string) => {
          // Ensure we return the actual Enum value Prisma expects
          return value.toUpperCase() as OnboardingStep;
        },
      },
      role: {
        type: "string",
        defaultValue: Role.USER,
        input: false,
        map: (value: string) => {
          // Ensure we return the actual Enum value Prisma expects
          return value.toUpperCase() as Role;
        },
      },
      countryOfResidence: {
        type: "string",
        input: false,
        required: false,
      },
      phone: {
        type: "string",
        input: false,
        required: false,
      },
      disabled: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  baseURL: NEXT_PUBLIC_URL,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create user Stats
          await prisma.userStats.create({
            data: {
              user: {
                connect: { id: user.id },
              },
            },
          });
        },
      },
    },

    session: {
      create: {
        before: async (session, ctx) => {
          const internalAdapter = ctx?.context?.internalAdapter;

          if (!internalAdapter) {
            throw new APIError("BAD_REQUEST", {
              message: "Access denied",
            });
          }

          const user = await internalAdapter.findUserById(session.userId);

          if (!user) {
            throw new APIError("BAD_REQUEST", {
              message: "Access denied",
            });
          }

          const role = "role" in user ? user.role : undefined;

          if (role !== Role.USER) {
            throw new APIError("BAD_REQUEST", {
              message: "Access denied",
            });
          }
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // Cache duration in seconds (10 minutes)
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      sendEmailVerification(user.name, url, user.email);
    },

    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 15 * 60,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // require email verification before signin

    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetVerification(user.name, url, user.email);
    },

    resetPasswordTokenExpiresIn: 15 * 60,
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [nextCookies()], // enables cookie setting in client. Make sure this is the last plugin in the array
});

export type User = typeof auth.$Infer.Session.user;

export const {
  signUpEmail,
  signInEmail,
  sendVerificationEmail,
  changePassword,
  requestPasswordReset,
  resetPassword,
  revokeSessions,
} = auth.api;
