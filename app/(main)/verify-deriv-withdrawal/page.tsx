import { Suspense } from "react";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import DerivWithdrawalVerification from "@/components/DerivWithdrawalVerification";
import InfoCard from "@/components/InfoCard";
import NotFound from "@/components/NotFoundPayment";
import { sendWithdrawEmail } from "@/lib/actions/deriv";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const Verification = async ({
  ...props
}: {
  transactionId: string;
  accountId: string;
  userId: string;
}) => {
  const result = await sendWithdrawEmail({
    userId: props.userId,
    accountId: props.accountId,
  });

  if (!result.success) {
    return (
      <InfoCard
        className="py-6 flex flex-center text-lg! text-red-500"
        message={
          result.error?.message ??
          "Unable to complete your withdrawal request. Please try again later"
        }
      />
    );
  }

  return <DerivWithdrawalVerification {...props} />;
};

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
    <Suspense
      fallback={
        <div className="flex-center flex mt-6">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <Verification
        accountId={data.extra.derivLoginId}
        transactionId={tx}
        userId={user.id}
      />
    </Suspense>
  );
};

export default DerivWithdrawalVerificationPage;
