import { notFound } from "next/navigation";
import { use } from "react";
import CopyToClipboard from "@/components/CopyToClipboard";
import StatusBadge from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import {
  formatDateTime,
  formatNumber,
  getTransactionDetailsByType,
  cn,
} from "@/lib/utils";

const DetailRow = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex w-full items-start justify-between gap-4 py-3 text-sm",
      className
    )}
  >
    <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
    <div className="text-right font-medium text-black-1 dark:text-white">{children}</div>
  </div>
);

const TransactionDetails = ({
  transactionPromise,
}: {
  transactionPromise: Promise<Transaction | null>;
}) => {
  const transaction = use(transactionPromise);

  if (!transaction) return notFound();

  const { status, amount, transactionId, createdAt, type, extra, fulfillment } =
    transaction;

  const renderTypeDetails = () => {
    if (type === "deriv_deposit") {
      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col items-end gap-1">
              <span>{extra.paidFromBankName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {extra.paidFromAccountNumber} • {extra.paidFromAccountName}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Fulfilled to">
            <div className="flex flex-col items-end gap-1">
              <span>Deriv account</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {extra.derivLoginId} • {extra.currency}
              </span>
            </div>
          </DetailRow>

          {fulfillment.fulfilledAt && (
            <DetailRow label="Fulfillment time">
              {formatDateTime(fulfillment.fulfilledAt)}
            </DetailRow>
          )}

          <DetailRow label="Received amount">
            {formatNumber(extra.amount)} {extra.currency}
          </DetailRow>
        </>
      );
    }

    if (type === "deriv_withdrawal") {
      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col items-end gap-1">
              <span>Deriv account</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {extra.derivLoginId} • {extra.currency}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Receiver">
            <div className="flex flex-col items-end gap-1">
              <span>{extra.receivingBankName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {extra.receivingBankAccountNumber} •{" "}
                {extra.recievingBankAccountName}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Received amount">
            {formatNumber(extra.amount)} {extra.currency}
          </DetailRow>

          {fulfillment.fulfilledAt && (
            <DetailRow label="Fulfillment time">
              {formatDateTime(fulfillment.fulfilledAt)}
            </DetailRow>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto flex w-full max-w-[550px] flex-col overflow-hidden rounded-3xl bg-white_dark-black-1 card-border p-6 sm:p-8">
      <div className="mb-6 flex flex-col items-center gap-4">
        <StatusBadge variant={status}>{status}</StatusBadge>
        <div className="flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
            Amount
          </span>
          <div className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="mr-1">₦</span>
            {formatNumber(amount)}
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="flex flex-col gap-1">
        <DetailRow label="Transaction type">
          {getTransactionDetailsByType(transaction).label}
        </DetailRow>

        {renderTypeDetails()}

        <DetailRow label="Reference ID">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">{transactionId}</span>
            <CopyToClipboard className="size-3.5 text-gray-500" text={transactionId} />
          </div>
        </DetailRow>

        <DetailRow label="Date" className="pb-0">
          {formatDateTime(createdAt)}
        </DetailRow>
      </div>
    </div>
  );
};

export default TransactionDetails;
