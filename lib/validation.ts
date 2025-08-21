import { z } from "zod";

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
