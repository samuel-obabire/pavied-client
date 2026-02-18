"use client";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValue, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import countryList from "react-select-country-list";
import type { z } from "zod";
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
import "react-phone-number-input/style.css";
import { updateUser } from "@/lib/actions/user.action";
import { AccountRegistrationSchema } from "@/lib/validation";
import { OnboardingStep } from "@/prisma/lib/generated/prisma/browser";
import ActionState, { type ActionStateType } from "../ActionState";
import CustomFormField, { FormFieldTypes } from "../CustomFormField";
import SaveOnboardingStep from "../SaveOnboardingStep";

const RegistrationForm = ({ defaultName }: { defaultName?: string }) => {
  const form = useForm<z.infer<typeof AccountRegistrationSchema>>({
    resolver: zodResolver(AccountRegistrationSchema),
    defaultValues: {
      name: defaultName || "",
      countryOfResidence: "",
      phone: "",
      whatsapp: "",
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
    <div className="space-y-8 pb-10">
      <ActionState
        state={actionState}
        pendingTitle="Registering Account"
        successTitle="Account successfully updated"
        errorMessage={errorMessage}
        retryAction={retrySubmit}
        successMessage={
          actionState === "success" && (
            <SaveOnboardingStep
              label="Continue to next step"
              nextRoute="ONBOARD_DERIV"
              onboardingStep={OnboardingStep.DERIV}
            />
          )
        }
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <CustomFormField
                  fieldType={FormFieldTypes.INPUT}
                  placeholder="John Doe"
                  field={field as FieldValue<FieldValues>}
                />
                <FormDescription>
                  This is your full name eg. John Doe
                </FormDescription>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of residence</FormLabel>
                <CustomFormField
                  fieldType={FormFieldTypes.SKELETON}
                  field={field as FieldValue<FieldValues>}
                >
                  <Select
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    instanceId="residence-select"
                    classNamePrefix="react-select"
                    options={options}
                    defaultInputValue=""
                    value={options.find(
                      (option) => option.value === field.value,
                    )}
                    onChange={(selected) => {
                      return field.onChange(
                        (selected as { value: string })?.value ?? "",
                      );
                    }}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    isClearable
                    maxMenuHeight={300}
                  />
                </CustomFormField>

                <FormDescription>
                  Select your country of residence
                </FormDescription>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Phone number</FormLabel>
                <CustomFormField
                  fieldType={FormFieldTypes.SKELETON}
                  field={field as FieldValue<FieldValues>}
                >
                  <FormControl className="w-full">
                    <PhoneInput
                      className=""
                      placeholder="+2348122233345"
                      defaultCountry="NG"
                      {...field}
                    />
                  </FormControl>
                </CustomFormField>
                <FormDescription>Enter your phone number.</FormDescription>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Whatsapp number (Optional)</FormLabel>
                <CustomFormField
                  fieldType={FormFieldTypes.SKELETON}
                  field={field as FieldValue<FieldValues>}
                >
                  <FormControl className="w-full">
                    <PhoneInput
                      className=""
                      placeholder="+2348122233345"
                      defaultCountry="NG"
                      {...field}
                    />
                  </FormControl>
                </CustomFormField>
                <FormDescription>Enter your whatsapp number.</FormDescription>
                <FormMessage className="form-error" />
              </FormItem>
            )}
          />

          <Button className="btn-primary  w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
