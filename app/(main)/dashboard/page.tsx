import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardTransactions from "@/components/dashboard/DashboardTransactions";
import StatsSkeleton from "@/components/skeletons/StatsSkeleton";
import TransactionListSkeleton from "@/components/skeletons/TransactionListSkeleton";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DashboardPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  return (
    <>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats userId={user.id} />
      </Suspense>

      <Suspense fallback={<TransactionListSkeleton />}>
        <DashboardTransactions userId={user.id} />
      </Suspense>
    </>
  );
};

export default DashboardPage;
