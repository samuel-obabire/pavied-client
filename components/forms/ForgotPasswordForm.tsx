"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";
import { ForgotPasswordSchema } from "@/lib/validation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { ArrowLeft, MailCheck } from "lucide-react";
import { sendResetPasswordEmailVerification } from "@/lib/actions/auth.action";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    setIsLoading(true);

    try {
      const response = await sendResetPasswordEmailVerification(values);

      if (response.success) {
        setIsSubmitted(true);
      } else {
        toast.error(response.error?.message || "Failed to send reset link");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 pt-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <MailCheck className="size-10" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-24-bold text-primary dark:text-white">
            Check your email
          </h2>
          <p className="text-16-medium text-black-1/60 dark:text-white/60 max-w-sm mx-auto">
            We sent a password reset link to <br />
            <span className="font-semibold text-primary dark:text-white">
              {form.getValues("email")}
            </span>
          </p>
        </div>

        <div className="grid w-full gap-4">
          <Button asChild className="btn-primary w-full shadow-md">
            <Link href={ROUTES.SIGN_IN}>Back to Sign In</Link>
          </Button>

          <p className="text-14-medium text-center text-black-1/50 dark:text-white/50">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => onSubmit(form.getValues())}
              className="text-secondary font-semibold hover:underline"
              disabled={isLoading}
            >
              {isLoading ? "Resending..." : "Click to resend"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
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

        <Button
          className="btn-primary w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </Button>

        <Button
          asChild
          variant="link"
          className="w-full text-black-1/50 dark:text-white/50"
        >
          <Link href={ROUTES.SIGN_IN} className="flex items-center gap-2">
            <ArrowLeft className="size-4" /> Back to Sign In
          </Link>
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
