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
import { signInWithEmail } from "@/lib/actions/auth.action";
import { ROUTES } from "@/lib/constants/routes";
import { SigninSchema } from "@/lib/validation";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      const result = await signInWithEmail(values);

      //Todo: handle error
      if (result.success) {
        router.push(ROUTES.DASHBOARD);
      } else {
        alert(result.error?.message);
      }
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
