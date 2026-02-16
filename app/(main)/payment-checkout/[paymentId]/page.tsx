import { Suspense } from "react";
import { redirect } from "next/navigation";
import ConnectedPaymentState from "@/components/payment/ConnectedPaymentState";
import PaymentStateSkeleton from "@/components/skeletons/PaymentStateSkeleton";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const PaymentCheckOut = async ({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) => {
  const session = await verifySession();
  const user = session?.user;
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { paymentId } = await params;

  return (
    <Suspense fallback={<PaymentStateSkeleton />}>
      <ConnectedPaymentState paymentId={paymentId} userId={user.id} />
    </Suspense>
  );
};

export default PaymentCheckOut;
