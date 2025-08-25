/* eslint-disable react/jsx-handler-names */

/* eslint-disable no-unused-vars */
import React, { ReactNode } from "react";
import type { FieldValues, ControllerRenderProps } from "react-hook-form";

import { FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

export enum FormFieldTypes {
  INPUT = "text",
  SELECT = "select",
  SKELETON = "skeleton",
}

type CustomFormFieldProps = {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder?: string;
  fieldType: FormFieldTypes;
  children?: ReactNode;
  selectValues?: string[];
};

const CustomFormField = ({ ...props }: CustomFormFieldProps) => {
  return (
    <FormControl>
      <RenderCustomField {...props} />
    </FormControl>
  );
};

export default CustomFormField;

const RenderCustomField = ({
  placeholder,
  fieldType,
  field,
  children,
}: CustomFormFieldProps) => {
  switch (fieldType) {
    case FormFieldTypes.INPUT:
      return (
        <Input
          className="inputClass"
          placeholder={placeholder}
          type={fieldType}
          {...field}
        />
      );

    case FormFieldTypes.SELECT:
      return (
        <Select onValueChange={field.onChange} value={field.value ?? ""}>
          <FormControl>
            <SelectTrigger className="no-ring select  !h-[44px] w-full bg-white">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="no-ring">{children}</SelectContent>
        </Select>
      );

    case FormFieldTypes.SKELETON:
      return <>{children}</>;

    default: {
      const exhaustiveCheck: never = fieldType;
      return exhaustiveCheck;
    }
  }
};
