"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import countryList from "react-select-country-list";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import "react-phone-number-input/style.css";
import { updateUser } from "@/lib/actions/user.action";
import { ROUTES } from "@/lib/constants";
import { AccountRegistrationSchema } from "@/lib/validation";

import ActionState, { ActionStateType } from "../ActionState";

const RegistrationForm = () => {
  const form = useForm<z.infer<typeof AccountRegistrationSchema>>({
    resolver: zodResolver(AccountRegistrationSchema),
    defaultValues: {
      fullName: "",
      countryOfResidence: "",
      phone: "",
      whatsApp: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [actionState, setActionState] = useState<ActionStateType>("idle");

  const options = useMemo(() => countryList().getData(), []);

  async function onSubmit(values: z.infer<typeof AccountRegistrationSchema>) {
    try {
      setActionState("pending");

      const response = await updateUser(values);

      if (response.success) {
        setActionState("success");
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
        pendingTitle="Registering Account"
        successTitle="Account  successfully registered"
        successMessage={
          <div className="flex-center flex">
            <Link href={ROUTES.HOME}>
              <Button variant="ghost" className="underline-button">
                <p className="underline">Continue to dashboard</p>
              </Button>
            </Link>
          </div>
        }
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    className="inputClass"
                    placeholder="John Doe"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your full name eg. John Doe
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of residence</FormLabel>
                <Select
                  instanceId="residence-select"
                  classNamePrefix="react-select"
                  className=""
                  options={options}
                  value={options.find((option) => option.value === field.value)}
                  onChange={(selected) => {
                    return field.onChange(
                      (selected as { value: string })?.value ?? ""
                    );
                  }}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  isClearable
                />

                <FormDescription>
                  Select your country of residence
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Phone number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    className=""
                    placeholder="8122233345"
                    {...field}
                    defaultCountry="NG"
                  />
                </FormControl>
                <FormDescription>Enter your phone number.</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsApp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Whatsapp number (Optional)</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    className=""
                    placeholder="8122233345"
                    {...field}
                    defaultCountry="NG"
                  />
                </FormControl>
                <FormDescription>Enter your whatsapp number.</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button className="btn-primary w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
