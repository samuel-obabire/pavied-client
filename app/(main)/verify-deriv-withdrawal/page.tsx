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
import { transactionIsDerivWithdrawal } from "@/lib/utils";

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

  const session = await verifySession();
  const user = session?.user;
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { data: transaction } = await getPaymentTransaction(tx);

  if (
    !transaction?.derivWithdrawalExtra ||
    !transactionIsDerivWithdrawal(transaction) ||
    transaction.userId !== user.id ||
    transaction.type !== "DERIV_WITHDRAWAL" ||
    transaction.status !== "PENDING"
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
        accountId={transaction.derivWithdrawalExtra.derivLoginId}
        transactionId={tx}
        userId={user.id}
      />
    </Suspense>
  );
};

export default DerivWithdrawalVerificationPage;
