import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import TransactionDetails from "@/components/TransactionDetails";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const TransactionDetailsPage = async ({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) => {
  const session = await verifySession();
  const user = session?.user;
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { paymentId = "" } = await params;
  if (!paymentId || typeof paymentId !== "string") return notFound();

  const transactionPromise = getPaymentTransaction(paymentId);

  return (
    <div className="space-y-6 px-4">
      <h1 className="text-16-medium">Transaction details</h1>

      <Suspense
        fallback={
          <div className="h-[30rem] w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800 max-w-[550px] mx-auto" />
        }
      >
        <TransactionDetails transactionPromise={transactionPromise} />
      </Suspense>
    </div>
  );
};

export default TransactionDetailsPage;
