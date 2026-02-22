"use server";
import { headers } from "next/headers";
import "server-only";

import { APIError, type User } from "better-auth";
import type z from "zod";
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  signInEmail,
  signUpEmail,
} from "@/auth";
import { ROUTES } from "../constants/routes";
import handleError from "../handlers/error";
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchemaWithToken,
  SendEmailVerification,
  SigninSchema,
  SignupSchema,
} from "../validation";

export const signInWithEmail = async (
  data: z.infer<typeof SigninSchema>,
): Promise<ActionResponse> => {
  const result = SigninSchema.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { email, password } = result.data;

    await signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
        callbackURL: ROUTES.DASHBOARD, // route to navigate when user clicks on the verification link
      },

      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.message === "Email not verified") {
        return {
          success: false,
          error: {
            message: "Email not verified",
            code: "EMAIL_NOT_VERIFIED",
          },
        };
      }
    }

    return handleError(error) as ErrorResponse;
  }
};

export const signUpWithEmail = async (
  data: z.infer<typeof SignupSchema>,
): Promise<ActionResponse<User>> => {
  const result = SignupSchema.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { email, name, password } = result.data;

    const { user } = await signUpEmail({
      body: {
        email,
        name,
        password,
        rememberMe: true,
        callbackURL: ROUTES.EMAIL_VERIFICATION_RESULT,
      },

      headers: await headers(),
    });

    return { success: true, data: user };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// To resend email verification to the user if token expired or other reasons
export const sendEmailVerification = async (
  data: z.infer<typeof SendEmailVerification>,
): Promise<ActionResponse> => {
  const result = SendEmailVerification.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { email } = result.data;

    await sendVerificationEmail({
      body: {
        email,
        callbackURL: ROUTES.EMAIL_VERIFICATION_RESULT,
      },

      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// For authenticated users
export const updatePassword = async (
  data: z.infer<typeof ChangePasswordSchema>,
): Promise<ActionResponse> => {
  const result = ChangePasswordSchema.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { currentPassword, newPassword } = result.data;

    await changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },

      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// For un-authenticated users
export const sendResetPasswordEmailVerification = async (
  data: z.infer<typeof ForgotPasswordSchema>,
): Promise<ActionResponse> => {
  const result = ForgotPasswordSchema.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { email } = result.data;

    await requestPasswordReset({
      body: {
        email,
        redirectTo: ROUTES.RESET_PASSWORD,
      },

      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// Call sendResetPasswordEmailVerification first
export const resetUserPassword = async (
  data: z.infer<typeof ResetPasswordSchemaWithToken>,
): Promise<ActionResponse> => {
  const result = ResetPasswordSchemaWithToken.safeParse(data);

  if (!result.success) {
    return handleError(result.error) as ErrorResponse;
  }

  try {
    const { newPassword, token } = result.data;

    const nextHeaders = await headers();

    await resetPassword({
      body: {
        newPassword,
        token,
      },

      headers: nextHeaders,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
