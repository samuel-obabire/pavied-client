"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { ChangePasswordSchema } from "@/lib/validation";
import ActionState, { type ActionStateType } from "../ActionState";

const ResetPasswordForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [actionState, setActionState] = useState<ActionStateType>("idle");

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    // TODO: Implement server action for password change
    console.log(values);
    
    // Simulate API call
    setActionState("pending");
    setTimeout(() => {
        setActionState("success");
    }, 1000);
  }

  return (
    <div className="space-y-8">
      <ActionState
        state={actionState}
        pendingTitle="Updating Password"
        successTitle="Password successfully updated"
        errorMessage={errorMessage}
        retryAction={() => form.handleSubmit(onSubmit)()}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter current password"
                    className="inputClass w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter new password"
                    className="inputClass w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Re-enter new password"
                    className="inputClass w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="btn-primary w-full h-12 text-16-bold"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
