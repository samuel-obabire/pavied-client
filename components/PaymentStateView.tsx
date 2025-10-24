import { calculatePaymentExpiry } from "@/lib/utils";

import ExpiredPayment from "./ExpiredPayment";
import FailedPayment from "./FailedPayment";
import MakePayment from "./MakePayment";
import NotFoundPayment from "./NotFoundPayment";
import PaymentSuccess from "./PaymentSuccess";
import ProcessingPayment from "./ProcessingPayment";

type Props = {
  payment: Transaction;
  currentUserId: string;
};

function getPaymentStateView({ payment, currentUserId }: Props) {
  if (payment.userId !== currentUserId) return <NotFoundPayment />;

  const { isExpired } = calculatePaymentExpiry(payment.createdAt, 10);

  if (payment.status === "pending" && isExpired) return <ExpiredPayment />;

  if (
    payment.status === "pending" &&
    "recieptPath" in payment.extra &&
    payment.extra.recieptPath
  ) {
    return <ProcessingPayment />;
  }

  if (payment.status === "processing" && !payment.fulfillment.fulfilled) {
    return <ProcessingPayment />;
  }

  if (payment.status === "failed") {
    return <FailedPayment />;
  }

  if (payment.status === "pending" && !isExpired) {
    return (
      <MakePayment paymentId={payment.transactionId} transaction={payment} />
    );
  }

  if (payment.status === "success") return <PaymentSuccess />;

  return <div>Something went wrong. Please contact support.</div>;
}

const PaymentStateView = ({ payment, currentUserId }: Props) => {
  return getPaymentStateView({ payment, currentUserId });
};

export default PaymentStateView;
