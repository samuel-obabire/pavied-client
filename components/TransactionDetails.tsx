import { use } from "react";
import { notFound } from "next/navigation";
import CopyToClipboard from "@/components/CopyToClipboard";
import StatusBadge from "@/components/StatusBadge";
import UploadReceiptDialog from "@/components/UploadReceiptDialog";
import { Separator } from "@/components/ui/separator";
import type { TransactionWithData } from "@/lib/prisma-adapters/types";
import {
  cn,
  formatDateTime,
  formatNumber,
  getTransactionDetailsByType,
  transactionIsDerivDeposit,
  transactionIsDerivWithdrawal,
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
      className,
    )}
  >
    <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
    <div className="text-right font-medium text-black-1 dark:text-white">
      {children}
    </div>
  </div>
);

const TransactionDetails = ({
  transactionPromise,
}: {
  transactionPromise: Promise<ActionResponse<TransactionWithData>>;
}) => {
  const { data: transaction } = use(transactionPromise);

  if (!transaction) return notFound();

  const { status, amount, transactionId, createdAt, fulfillmentFulfilledAt } =
    transaction;

  const renderTypeDetails = () => {
    if (
      transaction.derivDepositExtra &&
      transactionIsDerivDeposit(transaction)
    ) {
      const {
        paidFromAccountName,
        paidFromAccountNumber,
        paidFromBankName,
        derivLoginId,
        currency,
        amount: value,
      } = transaction.derivDepositExtra;

      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col items-end gap-1">
              <span>{paidFromBankName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {paidFromAccountNumber} • {paidFromAccountName}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Fulfilled to">
            <div className="flex flex-col items-end gap-1">
              <span>Deriv account</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {derivLoginId} • {currency}
              </span>
            </div>
          </DetailRow>

          {fulfillmentFulfilledAt && (
            <DetailRow label="Fulfillment time">
              {formatDateTime(fulfillmentFulfilledAt)}
            </DetailRow>
          )}

          <DetailRow label="Received amount">
            {formatNumber(value)} {currency}
          </DetailRow>
        </>
      );
    }

    if (
      transaction.derivWithdrawalExtra &&
      transactionIsDerivWithdrawal(transaction)
    ) {
      const {
        amount,
        currency,
        derivLoginId,
        receivingBankAccountNumber,
        receivingBankName,
        recievingBankAccountName,
      } = transaction.derivWithdrawalExtra;

      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col items-end gap-1">
              <span>Deriv account</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {derivLoginId} • {currency}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Receiver">
            <div className="flex flex-col items-end gap-1">
              <span>{receivingBankName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {receivingBankAccountNumber} • {recievingBankAccountName}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Received amount">
            {formatNumber(amount)} {currency}
          </DetailRow>

          {fulfillmentFulfilledAt && (
            <DetailRow label="Fulfillment time">
              {formatDateTime(fulfillmentFulfilledAt)}
            </DetailRow>
          )}
        </>
      );
    }

    return null;
  };

  const needsReceiptUpload =
    status === "PENDING" &&
    transactionIsDerivDeposit(transaction) &&
    !transaction.derivDepositExtra?.recieptPath;

  return (
    <div className="space-y-4">
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
              <CopyToClipboard
                className="size-3.5 text-gray-500"
                text={transactionId}
              />
            </div>
          </DetailRow>

          <DetailRow label="Date" className="pb-0">
            {formatDateTime(createdAt)}
          </DetailRow>
        </div>
      </div>

      {needsReceiptUpload && (
        <UploadReceiptDialog transactionId={transactionId} />
      )}
    </div>
  );
};

export default TransactionDetails;
