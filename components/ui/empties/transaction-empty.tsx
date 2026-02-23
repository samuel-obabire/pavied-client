import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionEmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export const TransactionEmptyState = ({
  title = "No Transactions Found",
  message = "You haven't made any transactions yet",
  className,
}: TransactionEmptyStateProps) => {
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
          <Receipt className="h-10 w-10 text-secondary dark:text-secondary" />
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

type TransactionEmptyStateOptions = {
  title?: string;
  message?: string;
};

export const getTransactionEmptyState = ({
  title = "No Transactions Found",
  message = "You haven't made any transactions yet",
}: TransactionEmptyStateOptions = {}) => {
  return {
    component: <TransactionEmptyState title={title} message={message} />,
  };
};

export default TransactionEmptyState;
