"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { DerivWithdrawalOTPSchema } from "@/lib/validation";

import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form";

const FormSchema = DerivWithdrawalOTPSchema.omit({ transactionId: true });

const InputWithdrawalOTP = ({
  onInput,
}: {
  transactionId: string;
  onInput: (data: z.infer<typeof FormSchema>) => Promise<void>;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const pin = form.watch("pin");

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      await onInput(data);
    },
    [onInput]
  );

  useEffect(() => {
    if (pin && pin.length === 8) {
      form.handleSubmit(onSubmit)();
    }
  }, [form, onSubmit, pin]);

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-8">
      <header className="text-center">
        <h1 className="text-16-bold md:text-28-bold mb-4">Verification</h1>
        <p className="text-12-medium md:text-20-medium">
          Insert withdrawal OTP to continue
        </p>
      </header>

      <div className="text-16-bold md:text-20-medium text-center">
        A verification code have been sent to email@gmail.com
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={8}
                      type="text"
                      inputMode="text"
                      {...field}

                    >
                      <InputOTPGroup className="flex gap-2 py-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage className="form-error bg-transparent text-center" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InputWithdrawalOTP;
