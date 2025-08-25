"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValue, FieldValues } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import "react-phone-number-input/style.css";
import { SelectItem } from "@/components/ui/select";
import { addUserBankAccount } from "@/lib/actions/user.action";
import { derivAcccounts } from "@/lib/constants";
import { bankAccountSchema } from "@/lib/validation";

import ActionState, { ActionStateType } from "../ActionState";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";
import DerivCurrencyIcon from "../DerivCurrencyIcon";

const Schema = bankAccountSchema.client;

const BankAccountRegister = () => {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    shouldFocusError: false,
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [actionState, setActionState] = useState<ActionStateType>("idle");

  async function onSubmit(values: z.infer<typeof Schema>) {
    try {
      setActionState("pending");

      const response = await addUserBankAccount({ ...values, bankCode: "030" });

      if (response.success) {
        setActionState("success");
        form.reset();
      } else {
        setErrorMessage(response.error?.message || "Something went wrong");
        setActionState("error");
      }
    } catch {
      setErrorMessage("Form submission error");
      setActionState("error");
    }
  }

  const retrySubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div>
      <ActionState
        state={actionState}
        pendingTitle="Adding Bank Account"
        successTitle="Account  successfully added"
        errorMessage={errorMessage}
        retryAction={retrySubmit}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-4 pb-34"
        >
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>

                <CustomFormField
                  field={field as FieldValue<FieldValues>}
                  fieldType={FormFieldTypes.SELECT}
                  placeholder="Select bank"
                >
                  {derivAcccounts.map((account) => (
                    <SelectItem
                      className="select p-4"
                      key={account.currency}
                      value={account.currency}
                    >
                      <div className="flex items-center justify-between">
                        <DerivCurrencyIcon currency={account.currency} />
                      </div>
                      <span className="!font-normal">|</span>
                      <span className="text-12-semibold">{account.name}</span>
                    </SelectItem>
                  ))}
                </CustomFormField>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account number</FormLabel>
                <CustomFormField
                  field={field as FieldValue<FieldValues>}
                  fieldType={FormFieldTypes.INPUT}
                  placeholder="0123456789"
                />
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account name</FormLabel>
                <CustomFormField
                  field={field as FieldValue<FieldValues>}
                  fieldType={FormFieldTypes.INPUT}
                  placeholder="John Doe"
                />
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-[#E2A7040D] p-2">
            <p className="text-12-regular sm:text-14-regular text-secondary">
              For your security, please ensure that the bank account you link is
              registered in your own name. Transactions from third-party or
              mismatched accounts will not be accepted
            </p>
          </div>

          <Button className="btn-secondary w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BankAccountRegister;
