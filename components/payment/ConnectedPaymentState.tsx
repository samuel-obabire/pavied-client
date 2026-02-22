import NotFoundPayment from "@/components/NotFoundPayment";
import PaymentStateView from "@/components/PaymentStateView";
import { getPaymentTransaction } from "@/lib/actions/payment.action";

const ConnectedPaymentState = async ({
  paymentId,
  userId,
}: {
  paymentId: string;
  userId: string;
}) => {
  const { success, data } = await getPaymentTransaction(paymentId);

  if (!success || data?.userId !== userId || data.type !== "DERIV_DEPOSIT") {
    return <NotFoundPayment />;
  }

  return <PaymentStateView transaction={JSON.parse(JSON.stringify(data))} />;
};

export default ConnectedPaymentState;
