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
import { SignupSchema } from "@/lib/validation";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    setIsLoading(true);
    try {
      // TODO: Implement actual signup logic here
      console.log("Signup values:", values);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
