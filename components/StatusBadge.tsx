import { HTMLAttributes, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  children: ReactNode;
  variant: BaseTransaction["status"];
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
