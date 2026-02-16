import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { TransactionStatus } from "@/prisma/lib/generated/prisma/enums";

type StatusBadgeProps = {
  children: ReactNode;
  variant: TransactionStatus;
  otherProps?: HTMLAttributes<HTMLSpanElement>;
};

const StatusBadge = ({
  children,
  variant,
  ...otherProps
}: StatusBadgeProps) => {
  return (
    <Badge
      {...otherProps}
      variant={variant}
      className="px-4 text-[14px] font-medium capitalize"
    >
      {children}
    </Badge>
  );
};

export default StatusBadge;
