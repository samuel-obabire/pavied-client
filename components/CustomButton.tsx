import { Loader2Icon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "link" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const CustomButton = ({
  disabled,
  size = "default",
  className,
  isLoading,
  children,
  variant,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      size={size}
      disabled={disabled || isLoading}
      className={className}
      variant={variant || "default"}
      {...props}
    >
      {isLoading && <Loader2Icon className="animate-spin" />}
      {isLoading ? "Please wait" : children}
    </Button>
  );
};

export default CustomButton;
