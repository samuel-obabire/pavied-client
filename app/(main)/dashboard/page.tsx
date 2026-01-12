import Link from "next/link";
import { redirect } from "next/navigation";
import StatsCard from "@/components/StatsCard";
import TransactionList from "@/components/TransactionList";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { getUserById } from "@/lib/actions/user.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DashboardPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const [getTransactionResponse, { data, success }] = await Promise.all([
    getUserTransactions(user?.id),
    getUserById(user.id),
  ]);

  if (!success) redirect(ROUTES.SIGN_IN);

  const {
    totalDeposits,
    totalWithdrawals,
    totalSuccessfulTransactions,
    totalTransactions,
  } = data!;

  return (
    <>
      <section className="grid flex-none grid-cols-2 gap-2 sm:gap-4 xl:flex">
        <StatsCard
          title="Total Transactions"
          subText="Total  transactions"
          description="Total transactions made so far. Both succesful and failed transactions"
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

      <article className="mt-8 flex-1 overflow-visible rounded-2xl pt-0">
        <header className="sticky top-0 left-0 z-10 mb-4 flex items-center justify-between px-2 py-2">
          <h2 className="text-20-medium text-black-1 dark:text-white">
            Recent Transactions
          </h2>
          <Link
            href={ROUTES.TRANSACTIONS}
            className="text-14-medium text-secondary transition-opacity hover:opacity-80"
          >
            View all
          </Link>
        </header>

        <TransactionList transactionRes={getTransactionResponse} />
      </article>
    </>
  );
};

export default DashboardPage;
