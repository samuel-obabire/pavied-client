import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import TransactionDetails from "@/components/TransactionDetails";
import { ROUTES } from "@/lib/constants/routes";
import { firestoreAdapter } from "@/lib/firebase/firestore.adapter";
import { verifySession } from "@/lib/server";

const TransactionDetailsPage = async ({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) => {
  const user = await verifySession();
  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const { paymentId = "" } = await params;
  if (!paymentId || typeof paymentId !== "string") return notFound();

  const transactionPromise =
    firestoreAdapter.transactions.getTransactionById(paymentId);

  return (
    <div className="space-y-6 px-4">
      <h1 className="text-16-medium">Transaction details</h1>

      <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800" />}>
        <TransactionDetails transactionPromise={transactionPromise} />
      </Suspense>
    </div>
  );
};

export default TransactionDetailsPage;
