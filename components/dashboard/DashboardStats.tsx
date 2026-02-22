import StatsCard from "@/components/StatsCard";
import { getUserStats } from "@/lib/actions/stats.action";

const DashboardStats = async ({ userId }: { userId: string }) => {
  const { data } = await getUserStats(userId);

  const { totalDeposits = 0, totalWithdrawals = 0 } = data || {};

  return (
    <section className="grid flex-none grid-cols-2 gap-2 sm:gap-4 xl:flex">
      <StatsCard
        title="Total Deposit"
        subText=""
        description="Total  deposits transactions made so far."
        count={totalDeposits}
        prefix="$"
        decimals={2}
      />
      <StatsCard
        title="Total Withdrawals"
        subText=""
        description="Total  withdrawals transactions made so far."
        count={totalWithdrawals}
        prefix="$"
        decimals={2}
      />
    </section>
  );
};

export default DashboardStats;
