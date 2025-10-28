import { notFound, redirect } from "next/navigation"

import CopyToClipboard from "@/components/CopyToClipboard"
import Divider from "@/components/Divider"
import { ROUTES } from "@/lib/constants/routes"
import { getTransactionById } from "@/lib/firebase/transactions"
import { verifySession } from "@/lib/server"
import {
  formatDateTime,
  formatNumber,
  getTransactionDetailsByType,
} from "@/lib/utils"

const DetailRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex w-full items-baseline justify-between gap-3">
    <span>{label}</span>
    <div className="text-right">{children}</div>
  </div>
)

const TransactionDetailsPage = async({
  params,
}: {
  params: Promise<{ paymentId: string }>
}) => {
  const user = await verifySession()
  if (!user?.id) redirect(ROUTES.SIGN_IN)

  const { paymentId = "" } = await params
  if (!paymentId || typeof paymentId !== "string") return notFound()

  const transaction = await getTransactionById(paymentId)
  if (!transaction) return notFound()

  const { status, amount, transactionId, createdAt, type, extra, fulfillment } =
    transaction

  const renderTypeDetails = () => {
    if (type === "deriv_deposit") {
      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col">
              <span>{extra.paidFromBankName}</span>
              <span>
                {extra.paidFromAccountNumber} | {extra.paidFromAccountName}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Fulfilled to">
            <div className="flex flex-col">
              <span>Deriv account</span>
              <span>
                {extra.derivLoginId} | {extra.currency}
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
      )
    }

    if (type === "deriv_withdrawal") {
      return (
        <>
          <DetailRow label="Source of funds">
            <div className="flex flex-col">
              <span>Deriv account</span>
              <span>
                {extra.derivLoginId} | {extra.currency}
              </span>
            </div>
          </DetailRow>

          <DetailRow label="Receiver">
            <div className="flex flex-col">
              <span>{extra.receivingBankName}</span>
              <span>
                {extra.receivingBankAccountNumber} |{" "}
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
      )
    }

    return null
  }

  const statusText =
    status === "success"
      ? <span className="text-success">Transaction successful</span>
      : status === "failed"
      ? <span className="text-failed">Failed</span>
      : <span className="text-secondary capitalize">{status}</span>

  return (
    <div className="space-y-6 px-4">
      <h1 className="text-16-medium">Transaction details</h1>

      <div className="bg-white_dark-black-1 card-border text-14-medium sm:text-16-medium mx-auto flex w-full max-w-[550px] flex-col items-center gap-3 rounded-3xl px-4 py-8">
        <div>{statusText}</div>

        <div className="text-32-normal font-bold">
          <span className="text-16-bold">₦</span>
          {formatNumber(amount)}
        </div>

        <Divider className="my-2 w-full" />

        <DetailRow label="Transaction type">
          {getTransactionDetailsByType(transaction).label}
        </DetailRow>

        {renderTypeDetails()}

        <DetailRow label="Txid">
          {transactionId}
          <CopyToClipboard className="size-4" text={transactionId} />
        </DetailRow>

        <DetailRow label="Date">{formatDateTime(createdAt)}</DetailRow>
      </div>
    </div>
  )
}

export default TransactionDetailsPage
