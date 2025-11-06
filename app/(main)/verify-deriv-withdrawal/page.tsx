import { redirect } from "next/navigation";
import DerivWithdrawalVerification from "@/components/DerivWithdrawalVerification";
import NotFound from "@/components/NotFoundPayment";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivWithdrawalVerificationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tx: string }>;
}) => {
  const { tx } = await searchParams;

  const user = await verifySession();
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { success, data } = await getPaymentTransaction(tx);

  if (
    !success ||
    data?.userId !== user.id ||
    data.type !== "deriv_withdrawal" ||
    data.status !== "pending"
  ) {
    return <NotFound />;
  }

  return (
    <DerivWithdrawalVerification
      transactionId={tx}
      accountId={data.extra.derivLoginId}
      userId={user.id}
    />
  );
};

export default DerivWithdrawalVerificationPage;
