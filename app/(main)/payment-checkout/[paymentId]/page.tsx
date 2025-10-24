import { redirect } from "next/navigation";

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

  const { success, data, error } = await getPaymentTransaction(paymentId);

  if (!success) {
    return error?.message;
  }

  return (
    <PaymentStateView
      currentUserId={user.id}
      payment={JSON.parse(JSON.stringify(data))}
    />
  );
};

export default PaymentCheckOut;
