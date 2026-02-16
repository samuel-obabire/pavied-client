"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useSession } from "@/lib/auth-client";
import "react-phone-number-input/style.css";

import Select from "react-select";
import countryList from "react-select-country-list";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { updateUser } from "@/lib/actions/user.action";
import { AccountRegistrationSchema } from "@/lib/validation";
import type { User } from "@/prisma/lib/generated/prisma/browser";
import ActionState, { type ActionStateType } from "../ActionState";

interface ProfileSettingsFormProps {
  user: User;
}

const ProfileSettingsForm = ({ user }: ProfileSettingsFormProps) => {
  const { data: session } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [actionState, setActionState] = useState<ActionStateType>("idle");
  const options = useMemo(() => countryList().getData(), []);

  const form = useForm<z.infer<typeof AccountRegistrationSchema>>({
    resolver: zodResolver(AccountRegistrationSchema),
    defaultValues: {
      name: user.name || "",
      countryOfResidence: user.countryOfResidence || "",
      phone: user.phone || "",
      whatsapp: user.whatsapp || "",
    },
  });

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

  return (
    <div className="space-y-8">
      <ActionState
        state={actionState}
        pendingTitle="Updating Profile"
        successTitle="Profile successfully updated"
        errorMessage={errorMessage}
        retryAction={() => form.handleSubmit(onSubmit)()}
      />

      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border border-border">
          <AvatarImage
            className="h-full w-full object-cover"
            src={session?.user?.image || "https://github.com/shadcn.png"}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="flex h-full w-full items-center justify-center bg-accent text-2xl font-bold">
            {session?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Full name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your full name"
                    className="inputClass w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Nationality
                </FormLabel>
                <FormControl>
                  <Select
                    menuPortalTarget={null}
                    instanceId="nationality-select"
                    classNamePrefix="react-select"
                    className="!border !border-gray-200/30 !rounded-sm"
                    options={options}
                    placeholder="Select your nationality"
                    value={options.find(
                      (option) => option.value === field.value,
                    )}
                    onChange={(selected) => {
                      field.onChange(
                        (selected as { value: string })?.value ?? "",
                      );
                    }}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    isClearable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2">
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Phone Number
                </FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Enter phone number"
                    defaultCountry="NG"
                    {...field}
                    className="PhoneInput w-full border border-gray-200/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2">
                <FormLabel className="text-16-medium text-black-1_dark-white">
                  Whatsapp number (Optional)
                </FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Enter whatsapp number"
                    defaultCountry="NG"
                    {...field}
                    className="PhoneInput w-full border border-gray-200/30"
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
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSettingsForm;
