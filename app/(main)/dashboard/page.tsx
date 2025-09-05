import Link from "next/link";

import StatsCard from "@/components/StatsCard";
import TransactionList from "@/components/TransactionList";

const Dashboard = () => {
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
          description="Total pending transactions made so far. Transactions that are yet to be completed"
          count={31}
        />
        <StatsCard
          title="Succesful Transactions"
          subText="Total succesful transactions"
          description="Total succesful transactions made so far. Transactions that were completed"
          count={19}
        />
      </section>

      <article className="flex-1 overflow-y-scroll rounded-2xl  px-4 pt-0">
        <header className="bg-accent sticky top-0 left-0 z-3  flex items-center justify-between py-6">
          <h2 className="">Recent Transactions</h2>
          <Link href="/">See More</Link>
        </header>

        <TransactionList />
      </article>
    </>
  );
};

export default Dashboard;
