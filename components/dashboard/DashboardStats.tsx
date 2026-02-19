import StatsCard from "@/components/StatsCard";
import { getUserStats } from "@/lib/actions/stats.action";

const DashboardStats = async ({ userId }: { userId: string }) => {
  const { data } = await getUserStats(userId);

  const {
    totalDeposits = 0,
    totalWithdrawals = 0,
    totalSuccessfulTransactions = 0,
    totalTransactions = 0,
  } = data || {};

  return (
    <section className="grid flex-none grid-cols-2 gap-2 sm:gap-4 xl:flex">
      <StatsCard
        title="Total Deposit"
        subText="Total deriv deposit"
        description="Total deriv deposits transactions made so far."
        count={totalDeposits}
        prefix="$"
        decimals={2}
      />
      <StatsCard
        title="Total Withdrawals"
        subText="Total deriv Withdrawals"
        description="Total deriv withdrawals transactions made so far."
        count={totalWithdrawals}
        prefix="$"
        decimals={2}
      />
      <StatsCard
        title="Total Transactions"
        subText="Total transactions"
        description="Total transactions made so far. Both successful and failed transactions"
        count={totalTransactions}
      />
      <StatsCard
        title="Successful Transactions"
        subText="Total successful transactions"
        description="Total successful transactions made so far. Transactions that were success"
        count={totalSuccessfulTransactions}
      />
    </section>
  );
};

export default DashboardStats;
