import StatsCard from "@/components/StatsCard";
import { getUserById } from "@/lib/actions/user.action";

const DashboardStats = async ({ userId }: { userId: string }) => {
  const { data } = await getUserById(userId);

  const {
    totalDeposits = 0,
    totalWithdrawals = 0,
    totalSuccessfulTransactions = 0,
    totalTransactions = 0,
  } = data || {};

  return (
    <section className="grid flex-none grid-cols-2 gap-2 sm:gap-4 xl:flex">
      <StatsCard
        title="Total Transactions"
        subText="Total transactions"
        description="Total transactions made so far. Both successful and failed transactions"
        count={totalTransactions}
      />
      <StatsCard
        title="Total Deposit"
        subText="Total deriv deposit"
        description="Total deriv deposits transactions made so far."
        count={totalDeposits}
      />
      <StatsCard
        title="Successful Transactions"
        subText="Total successful transactions"
        description="Total successful transactions made so far. Transactions that were success"
        count={totalSuccessfulTransactions}
      />
      <StatsCard
        title="Total Withdrawals"
        subText="Total deriv Withdrawals"
        description="Total deriv withdrawals transactions made so far."
        count={totalWithdrawals}
      />
    </section>
  );
};

export default DashboardStats;
