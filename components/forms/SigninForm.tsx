"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendEmailVerification, signInWithEmail } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/routes";
import { SigninSchema } from "@/lib/validation";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUnverifiedError, setShowUnverifiedError] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninSchema>) {
    setIsLoading(true);
    setShowUnverifiedError(false);
    try {
      const result = await signInWithEmail(values);

      //Todo: handle error
      if (result.success) {
        toast.success("Signed in successfully");
        router.push(ROUTES.DASHBOARD);
      } else {
        if (result.error?.code === "EMAIL_NOT_VERIFIED") {
          setShowUnverifiedError(true);
          toast.error("Email not verified", {
            description: "Click resend and check your email to verify your account.",
            action: {
              label: "Resend",
              onClick: () => handleResendVerification(values.email),
            },
          });
          return;
        }
        toast.error(result.error?.message || "Sign in failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification(email: string) {
    try {
      const res = await sendEmailVerification({ email });
      if (res.success) {
        toast.success("Verification email sent!", {
          description: "Please check your inbox.",
        });
      } else {
        toast.error(res.error?.message || "Failed to send verification email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending verification email.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {showUnverifiedError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md animate-in fade-in slide-in-from-top-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex flex-wrap items-center gap-2">
                <p className="text-sm text-yellow-700">
                  Your email is yet not verified. 
                </p>
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary p-0 h-auto font-semibold"
                    onClick={() => handleResendVerification(form.getValues("email"))}
                    type="button"
                  >
                    Resend Verification Email
                  </Button>
              </div>
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <CustomFormField
                fieldType={FormFieldTypes.INPUT}
                placeholder="johndoe@example.com"
                field={field as any}
              />
              <FormMessage className="form-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <CustomFormField
                fieldType={FormFieldTypes.PASSWORD}
                placeholder="********"
                field={field as any}
              />
              <FormMessage className="form-error" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-14-regular text-secondary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          className="btn-primary w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};


export default SigninForm;
