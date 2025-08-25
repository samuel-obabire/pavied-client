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
import { addUserDerivAccount } from "@/lib/actions/user.action";
import { derivAcccounts } from "@/lib/constants";
import { DerivAccountSchema } from "@/lib/validation";

import ActionState, { ActionStateType } from "../ActionState";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";
import DerivCurrencyIcon from "../DerivCurrencyIcon";

const Schema = DerivAccountSchema.client;
const DerivAccountRegister = () => {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    shouldFocusError: false,
    defaultValues: {
      accountId: "",
      currency: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [actionState, setActionState] = useState<ActionStateType>("idle");

  async function onSubmit(values: z.infer<typeof Schema>) {
    try {
      setActionState("pending");

      const response = await addUserDerivAccount(values as DerivAccount);

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
        pendingTitle="Adding Deriv Account"
        successTitle="Account  added sucessfully"
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Type</FormLabel>

                <CustomFormField
                  field={field as FieldValue<FieldValues>}
                  fieldType={FormFieldTypes.SELECT}
                  selectValues={["USD", "tUSDT", "eUSDT"]}
                  placeholder="Select currency"
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
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account number</FormLabel>
                <CustomFormField
                  field={field as FieldValue<FieldValues>}
                  fieldType={FormFieldTypes.INPUT}
                  placeholder="CR123456"
                />
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <Button className="btn-secondary w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DerivAccountRegister;
