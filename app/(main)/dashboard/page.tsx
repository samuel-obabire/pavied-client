import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardTransactions from "@/components/dashboard/DashboardTransactions";
import QuickActions from "@/components/dashboard/QuickActions";
import ExchangeRates, { ExchangeRatesSkeleton } from "@/components/dashboard/ExchangeRates";
import LinkedAccountsOverview, { LinkedAccountsSkeleton } from "@/components/dashboard/LinkedAccountsOverview";
import TransactionListSkeleton from "@/components/skeletons/TransactionListSkeleton";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DashboardPage = async () => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  return (
    <>
      <QuickActions />

      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        <Suspense fallback={<LinkedAccountsSkeleton />}>
          <LinkedAccountsOverview userId={user.id} />
        </Suspense>

        <Suspense fallback={<ExchangeRatesSkeleton />}>
          <ExchangeRates />
        </Suspense>
      </div>

      <Suspense fallback={<TransactionListSkeleton />}>
        <DashboardTransactions userId={user.id} />
      </Suspense>
    </>
  );
};

export default DashboardPage;
