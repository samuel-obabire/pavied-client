import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type DerivEmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export const DerivEmptyState = ({
  title = "No Deriv Accounts Found",
  message = "You haven't connected any Deriv accounts yet",
  className,
}: DerivEmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 shadow-lg">
          <TrendingUp className="h-10 w-10 text-primary dark:text-white" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-18-bold text-black-1 dark:text-white">{title}</h3>
        <p className="text-14-regular text-black-1/60 dark:text-white/60 max-w-xs">
          {message}
        </p>
      </div>
    </div>
  );
};

type DerivAccountEmptyStateOptions = {
  title?: string;
  message?: string;
};

export const getDerivAccountEmptyState = ({
  title = "No Deriv Accounts Found",
  message = "You haven't connected any Deriv accounts yet",
}: DerivAccountEmptyStateOptions = {}) => {
  return {
    component: <DerivEmptyState title={title} message={message} />,
  };
};

export default DerivEmptyState;
