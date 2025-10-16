import { z } from "zod";

import { OnboardingStep } from "./constants/onboarding";
import { supportedDerivAccountsType } from "./constants/supportedDerivAccountsType";

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
  // client: z.object({
  //   currency: z
  //     .enum(supportedDerivAccountsType.map((account) => account.currency))
  //     .or(z.literal("")),
  //   accountId: z
  //     .string()
  //     .min(3, { error: "Please provide your the currency account number" }),
  // }),
  server: z.object({
    currency: z.enum(
      supportedDerivAccountsType.map((account) => account.currency)
    ),
    accountId: z
      .string()
      .min(3, { error: "Please provide your the currency account number" }),
  }),
};

export const DerivAccountLinkSchema = z.array(
  z.object({
    currency: z
      .enum(supportedDerivAccountsType.map((account) => account.currency))
      .or(z.literal("")),
    accountId: z
      .string()
      .min(3, { error: "Please provide your the currency account number" }),
    token: z.string().min(5, { error: "Token is required" }),
  })
);

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

export const DerivDepositSchema = z.object({
  depositBankAccount: z.object({
    accountNumber: z
      .string()
      .min(10, { error: "Bank account number is required" }),
    accountName: z.string().min(3, { error: "Bank account Name required" }),
    bankName: z.string().min(3, { error: "Please select your bank" }),
    bankCode: z.string().min(2, { error: "Invalid bank code" }),
  }),
  depositDerivAccount: z.object({
    currency: z.enum(
      supportedDerivAccountsType.map((account) => account.currency)
    ),
    accountId: z
      .string()
      .min(3, { error: "Please provide your the currency account number" }),
  }),
  nairaAmount: z.number().min(500, { error: "Invalid naira Amount" }),
  convertedAmount: z.number().min(1, { error: "Invalid equivalent Amount" }),
});

const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

export const UploadPaymentRecieptSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, {
      message: "A valid file is required",
    })
    .refine((file) => allowedMimeTypes.includes(file.type), {
      message: "Only JPG, PNG, or PDF files are allowed",
    })
    .refine((file) => file.size <= maxFileSize, {
      message: "File size must not exceed 5MB",
    }),
  paymentId: z.string().min(5, { message: "Payment ID is required" }),
});
