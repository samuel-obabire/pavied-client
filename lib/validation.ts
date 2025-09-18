import { z } from "zod";

import { derivAcccounts } from "./constants/derivAccounts";
import { OnboardingStep } from "./constants/onBoardingStep";

export const AccountRegistrationSchema = z.object({
  fullName: z.string().min(5, {
    error: "Name is required and must have a minimum of 5 characters",
  }),
  countryOfResidence: z
    .string()
    .min(2, { error: "Please select your nationality" }),
  phone: z.string().min(6, { error: "Please enter your phone number" }),
  whatsApp: z
    .string()
    .min(6, { error: "Please enter a valid  number" })
    .optional()
    .or(z.literal("")),
});

export const DerivAccountSchema = {
  client: z.object({
    currency: z
      .enum(derivAcccounts.map((account) => account.currency))
      .or(z.literal("")),
    accountId: z
      .string()
      .min(3, { error: "Please provide your the currency account number" }),
  }),
  server: z.object({
    currency: z.enum(derivAcccounts.map((account) => account.currency)),
    accountId: z
      .string()
      .min(3, { error: "Please provide your the currency account number" }),
  }),
};

export const bankAccountSchema = {
  client: z.object({
    bankName: z.string().min(3, { error: "Please select your bank" }),
    accountName: z
      .string()
      .min(5, { error: "Please select your bank account name" }),
    accountNumber: z
      .string()
      .min(10, { error: "Please provide a valid bank account number" }),
  }),

  server: z.object({
    bankName: z.string().min(3, { error: "Please select your bank" }),
    accountName: z
      .string()
      .min(5, { error: "Please select your bank account name" }),
    accountNumber: z
      .string()
      .min(10, { error: "Please provide a valid bank account number" }),
    bankCode: z
      .string()
      .min(3, { error: "Please provide bank code with min of 3 characters" }),
  }),
};

export const OnboardingStepSchema = z.object({
  onboardingStep: z.enum(OnboardingStep),
});
