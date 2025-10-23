import Link from "next/link";
import { redirect } from "next/navigation";

import StatsCard from "@/components/StatsCard";
import TransactionList from "@/components/TransactionList";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DashboardPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const getTransactionResponse = await getUserTransactions(user?.id);

  return (
    <>
      <section className="grid  flex-none grid-cols-2 gap-4 xl:flex">
        <StatsCard
          title="Total Transactions"
          subText="Total  transactions"
          description="Total transactions made so far. Both succesful and failed transactions"
          count={20}
        />
        <StatsCard
          title="Declined Transactions"
          subText="Total orders declined"
          description="Total declined transactions made so far. Transactions that were not succesful"
          count={1}
        />
        <StatsCard
          title="Pending Transactions"
          subText="Total pending transactions"
          description="Total pending transactions made so far. Transactions that are yet to be success"
          count={31}
        />
        <StatsCard
          title="Succesful Transactions"
          subText="Total succesful transactions"
          description="Total succesful transactions made so far. Transactions that were success"
          count={19}
        />
      </section>

      <article className="mt-4 flex-1 overflow-y-scroll rounded-2xl  pt-0">
        <header className="bg-white_dark-black-1 sticky  top-0 left-0 z-3 flex items-center justify-between  rounded-lg px-2  py-4 md:px-6">
          <h2 className="">Recent Transactions</h2>
          <Link href="/">View all</Link>
        </header>

        <TransactionList transactionRes={getTransactionResponse} />
      </article>
    </>
  );
};

export default DashboardPage;
