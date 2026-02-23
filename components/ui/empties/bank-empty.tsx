import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type BankEmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export const BankEmptyState = ({
  title = "No Bank Accounts Found",
  message = "You haven't added any bank accounts yet",
  className,
}: BankEmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 dark:from-secondary/30 dark:to-secondary/20 shadow-lg">
          <Wallet className="h-10 w-10 text-secondary dark:text-secondary/90" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-18-bold text-black-1_dark-white">{title}</h3>
        <p className="text-14-regular text-black-1/60 dark:text-white/60 max-w-xs">
          {message}
        </p>
      </div>
    </div>
  );
};

type BankAccountEmptyStateOptions = {
  title?: string;
  message?: string;
};

export const getBankAccountEmptyState = ({
  title = "No Bank Accounts Found",
  message = "You haven't added any bank accounts yet",
}: BankAccountEmptyStateOptions = {}) => {
  return {
    component: <BankEmptyState title={title} message={message} />,
  };
};

export default BankEmptyState;
