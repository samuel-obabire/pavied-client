"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { getPaymentTransaction } from "@/lib/actions/payment.action";

import FailedPayment from "./FailedPayment";
import MakePayment from "./MakePayment";
import PaymentSuccess from "./PaymentSuccess";
import PendingPayment from "./PendingPayment";
import ProcessingPayment from "./ProcessingPayment";

type Props = { transaction: DerivDeposit };

function getPaymentStateView(tx: Transaction) {
  switch (tx.status) {
    case "pending":
      return <PendingPayment />;
    case "processing":
      return <ProcessingPayment />;
    case "failed":
      return <FailedPayment />;
    case "success":
      return <PaymentSuccess />;
  default:{
    const exhaustiveCheck:never = tx.status
    console.log(exhaustiveCheck)
   throw new Error(`Unhandled transaction status: ${exhaustiveCheck}`);
  }
  }
}

const PaymentStateView = ({ transaction }: Props) => {
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);
  const [recieptUploadSuccess, setRecieptUploadSucess] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If already done, don't start polling
    if (["success", "failed"].includes(transaction.status) || !updatedTransaction.extra.recieptPath) return;

    intervalRef.current = setInterval(async () => {
      console.log("Polling payment status...");

      try {
        const response = await getPaymentTransaction(transaction.transactionId);

        if (response.success && response.data) {
          const newTx = response.data as DerivDeposit;

         setUpdatedTransaction((prevTx) => {
          if (prevTx.status === newTx.status) return prevTx; //  no re-render
              return newTx; // re-render
            });

          if (["success", "failed"].includes(newTx.status)) {
            clearInterval(intervalRef.current!);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 7000);

    return () => clearInterval(intervalRef.current!);
  }, [transaction.transactionId, transaction.status, updatedTransaction.extra.recieptPath]);

  const handleRecieptUploadSuccess = useCallback((isSuccess:boolean) => {
    setRecieptUploadSucess(isSuccess)
  }, [])

const isRecieptUploaded = (("recieptPath" in updatedTransaction.extra &&
     updatedTransaction.extra.recieptPath) || recieptUploadSuccess)

  if (!isRecieptUploaded) {
    return (<MakePayment handleRecieptUploadSuccess={handleRecieptUploadSuccess} transaction={updatedTransaction} />);
  }

  return getPaymentStateView(updatedTransaction);
};

export default PaymentStateView;
