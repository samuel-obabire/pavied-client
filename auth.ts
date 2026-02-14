import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { OnboardingStep } from "./prisma/lib/generated/prisma/enums";

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
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // Cache duration in seconds (10 minutes)
    },
  },
});

export type User = typeof auth.$Infer.Session;
