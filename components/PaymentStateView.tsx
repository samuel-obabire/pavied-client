"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import FailedPayment from "./FailedPayment";
import MakePayment from "./MakePayment";
import PaymentSuccess from "./PaymentSuccess";
import PendingPayment from "./PendingPayment";
import ProcessingPayment from "./ProcessingPayment";

type Props = { transaction: DerivDeposit };

function getPaymentStateView(
  tx: DerivDeposit,
  uploadedAt?: Date,
): React.ReactNode {
  switch (tx.status) {
    case "pending":
      return <PendingPayment transaction={tx} />;
    case "processing":
      return <ProcessingPayment transaction={tx} uploadedAt={uploadedAt} />;
    case "failed":
      return <FailedPayment transaction={tx} />;
    case "success":
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
      ["success", "failed"].includes(transaction.status) ||
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
          const newTx = response.data as DerivDeposit;

          setUpdatedTransaction((prevTx) => {
            if (prevTx.status === newTx.status) return prevTx;
            return newTx;
          });

          if (["success", "failed"].includes(newTx.status)) {
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
    ("recieptPath" in updatedTransaction.extra &&
      updatedTransaction.extra.recieptPath) ||
    recieptUploadSuccess;

  if (!isRecieptUploaded) {
    return (
      <MakePayment
        handleRecieptUploadSuccess={handleRecieptUploadSuccess}
        transaction={updatedTransaction}
      />
    );
  }

  // After receipt upload, show ProcessingPayment immediately unless status is success/failed
  if (["success", "failed"].includes(updatedTransaction.status)) {
    return getPaymentStateView(updatedTransaction, uploadedAt);
  }

  // Receipt uploaded but not yet fully processed - show processing state
  return (
    <ProcessingPayment
      transaction={updatedTransaction}
      uploadedAt={uploadedAt}
    />
  );
};

export default PaymentStateView;
