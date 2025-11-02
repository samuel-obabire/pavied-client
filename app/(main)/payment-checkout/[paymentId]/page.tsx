import { redirect } from "next/navigation";

import NotFoundPayment from "@/components/NotFoundPayment";
import PaymentStateView from "@/components/PaymentStateView";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const PaymentCheckOut = async ({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) => {
  const user = await verifySession();
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { paymentId } = await params;

  const { success, data } = await getPaymentTransaction(paymentId);
  if (!success || data?.userId !== user.id) return <NotFoundPayment />;

  return (
    <PaymentStateView
      transaction={JSON.parse(JSON.stringify(data))}
    />
  );
};

export default PaymentCheckOut;
