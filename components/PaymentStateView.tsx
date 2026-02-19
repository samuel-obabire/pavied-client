"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import type { TransactionWithData } from "@/lib/prisma-adapters/types";
import FailedPayment from "./FailedPayment";
import MakePayment from "./MakePayment";
import PaymentSuccess from "./PaymentSuccess";
import PendingPayment from "./PendingPayment";
import ProcessingPayment from "./ProcessingPayment";

type Props = { transaction: TransactionWithData };

function getPaymentStateView(
  tx: TransactionWithData,
  uploadedAt?: Date,
): React.ReactNode {
  switch (tx.status) {
    case "PENDING":
      return <PendingPayment transaction={tx} />;
    case "PROCESSING":
      return <ProcessingPayment transaction={tx} uploadedAt={uploadedAt} />;
    case "FAILED":
      return <FailedPayment transaction={tx} />;
    case "SUCCESS":
      return <PaymentSuccess transaction={tx} />;
    default: {
      const exhaustiveCheck: never = tx.status;
      throw new Error(`Unhandled transaction status: ${exhaustiveCheck}`);
    }
  }
}

const PaymentStateView = ({ transaction }: Props) => {
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);
  const [recieptUploadSuccess, setRecieptUploadSucess] = useState(false);
  const [uploadedAt, setUploadedAt] = useState<Date | undefined>(undefined);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      (["SUCCESS", "FAILED"] as string[]).includes(transaction.status) ||
      !recieptUploadSuccess
    )
      return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    intervalRef.current = setInterval(async () => {
      try {
        const response = await getPaymentTransaction(transaction.transactionId);

        if (response.success && response.data) {
          const newTx = response.data as TransactionWithData;

          setUpdatedTransaction((prevTx) => {
            if (prevTx.status === newTx.status) return prevTx;
            return newTx;
          });

          if (
            (["SUCCESS", "FAILED"] as string[]).includes(newTx.status)
          ) {
            clearInterval(intervalRef.current!);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 10000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalRef.current!);
    };
  }, [transaction.transactionId, transaction.status, recieptUploadSuccess]);

  const handleRecieptUploadSuccess = useCallback((isSuccess: boolean) => {
    setRecieptUploadSucess(isSuccess);
    if (isSuccess) {
      setUploadedAt(new Date());
    }
  }, []);

  const isRecieptUploaded =
    !!updatedTransaction.derivDepositExtra?.recieptPath ||
    recieptUploadSuccess;

  if (!isRecieptUploaded) {
    return (
      <MakePayment
        handleRecieptUploadSuccess={handleRecieptUploadSuccess}
        transaction={updatedTransaction}
      />
    );
  }

  if (
    (["SUCCESS", "FAILED"] as string[]).includes(updatedTransaction.status)
  ) {
    return getPaymentStateView(updatedTransaction, uploadedAt);
  }

  return (
    <ProcessingPayment
      transaction={updatedTransaction}
      uploadedAt={uploadedAt}
    />
  );
};

export default PaymentStateView;
