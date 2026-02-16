"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";
import { ResetPasswordSchema } from "@/lib/validation";
import { ROUTES } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setIsLoading(true);
    try {
      // TODO: Implement actual password reset logic here
      console.log("Reset password values:", values);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
      router.push(ROUTES.SIGN_IN);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <CustomFormField
                fieldType={FormFieldTypes.PASSWORD}
                placeholder="********"
                field={field as any}
              />
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
              <CustomFormField
                fieldType={FormFieldTypes.PASSWORD}
                placeholder="********"
                field={field as any}
              />
              <FormMessage className="form-error" />
            </FormItem>
          )}
        />

        <Button
            className="btn-primary w-full mt-4"
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
