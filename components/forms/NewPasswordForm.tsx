"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/lib/validation";
import { resetUserPassword } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface NewPasswordFormProps {
  token: string;
}

const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setIsLoading(true);

    try {
      const response = await resetUserPassword({
        ...values,
        token,
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully");
        setTimeout(() => router.push(ROUTES.SIGN_IN), 3000);
      } else {
        toast.error(response.error?.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 pt-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-24-bold text-primary dark:text-white">
            Password Reset Successful
          </h2>
          <p className="text-16-medium text-black-1/60 dark:text-white/60 max-w-sm mx-auto">
            Your password has been updated. You will be redirected to sign in
            shortly.
          </p>
        </div>

        <Button asChild className="btn-primary w-full shadow-md">
          <Link href={ROUTES.SIGN_IN}>Sign In Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="inputClass w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="form-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="inputClass w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="form-error" />
            </FormItem>
          )}
        />

        <Button
          className="btn-primary w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
