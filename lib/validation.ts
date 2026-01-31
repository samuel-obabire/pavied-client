import { z } from "zod";
import { OnboardingStep } from "./constants/onboarding";
import { supportedDerivAccountsType } from "./constants/supportedDerivAccountsType";

export const AccountRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(5, {
      error: "Name is required and must have a minimum of 5 characters",
    })
    .max(30, { error: "Name must have a maximum character of 30 characters" }),
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
      supportedDerivAccountsType.map((account) => account.currency),
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
  }),
);

export const bankAccountSchema = {
  client: z.object({
    bankName: z.string().min(3, { error: "Please select your bank" }).trim(),
    accountName: z
      .string()
      .min(5, { error: "Please select your bank account name" })
      .toUpperCase()
      .trim(),
    accountNumber: z
      .string()
      .min(10, { error: "Please provide a valid bank account number" })
      .trim(),
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
  currency: z.string().min(3, { error: "Currency is required" }),
  derivLoginId: z.string().min(3, { error: "Deriv login ID is required" }),
  paidFromBankName: z
    .string()
    .min(2, { error: "Paid from bank name is required" }),
  paidFromBankCode: z
    .string()
    .min(2, { error: "Paid from bank code is required" }),
  paidFromAccountNumber: z
    .string()
    .min(10, { error: "Paid from account number is required" }),
  paidFromAccountName: z
    .string()
    .min(2, { error: "Paid from account name is required" }),
  amount: z
    .number({ error: "Amount is required" })
    .positive({ error: "Amount must be greater than 0" }),
  usedRate: z
    .number({ error: "usedRate is required" })
    .positive({ error: "usedRate must be greater than 0" }),
});

export const DerivWithdrawalSchema = z.object({
  currency: z.string().min(3, { error: "Currency is required" }),
  derivLoginId: z.string().min(1, { error: "Deriv login ID is required" }),
  receivingBankAccountNumber: z
    .string()
    .min(5, { error: "Receiving bank account number is required" }),
  recievingBankAccountName: z
    .string()
    .min(1, { error: "Receiving bank account name is required" }),
  receivingBankCode: z
    .string()
    .min(1, { error: "Receiving bank code is required" }),
  receivingBankName: z
    .string()
    .min(1, { error: "Receiving bank name is required" }),
  amount: z
    .number({ error: "Amount is required" })
    .positive({ error: "Amount must be greater than 0" }),
  usedRate: z
    .number({ error: "usedRate is required" })
    .positive({ error: "usedRate must be greater than 0" }),
});

const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

export const UploadPaymentRecieptSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, {
      error: "A valid file is required",
    })
    .refine((file) => allowedMimeTypes.includes(file.type), {
      error: "Only JPG, PNG, or PDF files are allowed",
    })
    .refine((file) => file.size <= maxFileSize, {
      error: "File size must not exceed 5MB",
    }),
  paymentId: z.string().min(5, { error: "Payment ID is required" }),
});

export const DerivWithdrawalOTPSchema = z.object({
  transactionId: z.string().min(6, { error: "Transaction ID is required" }),
  pin: z.string().min(8, {
    error: "Your one-time code must be 6 characters.",
  }),
});
