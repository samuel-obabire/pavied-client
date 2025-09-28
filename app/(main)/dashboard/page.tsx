import Link from "next/link";

import StatsCard from "@/components/StatsCard";
import TransactionList from "@/components/TransactionList";

const transactions: Transaction[] = [
  {
    transactionId: "tx001",
    userId: "user1",
    amount: 150,
    currency: "USD",
    status: "completed",
    provider: "Deriv",
    reference: "REF-001",
    fulfilledTo: "CR12345",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "deriv_deposit",
    accountId: "CR12345",
  },
  {
    transactionId: "tx002",
    userId: "user2",
    amount: 200,
    currency: "USD",
    status: "pending",
    provider: "Deriv",
    reference: "REF-002",
    fulfilledTo: "CR67890",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "deriv_withdrawal",
    accountId: "CR67890",
  },
  {
    transactionId: "tx003",
    userId: "user3",
    amount: 1000,
    currency: "NGN",
    status: "completed",
    provider: "MTN",
    reference: "REF-003",
    fulfilledTo: "08031234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_purchase",
    phoneNumber: "08031234567",
    network: "MTN",
  },
  {
    transactionId: "tx004",
    userId: "user4",
    amount: 2000,
    currency: "NGN",
    status: "completed",
    provider: "Airtel",
    reference: "REF-004",
    fulfilledTo: "08071234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "data_purchase",
    phoneNumber: "08071234567",
    bundleId: "2GB_WEEKLY",
    network: "Airtel",
  },
  {
    transactionId: "tx005",
    userId: "user5",
    amount: 500,
    currency: "NGN",
    status: "failed",
    provider: "Glo",
    reference: "REF-005",
    fulfilledTo: "08151234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_to_cash",
    phoneNumber: "08151234567",
    network: "Glo",
  },
  {
    transactionId: "tx006",
    userId: "user1",
    amount: 300,
    currency: "USD",
    status: "completed",
    provider: "Deriv",
    reference: "REF-006",
    fulfilledTo: "CR12345",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "deriv_deposit",
    accountId: "CR12345",
  },
  {
    transactionId: "tx007",
    userId: "user2",
    amount: 1500,
    currency: "NGN",
    status: "completed",
    provider: "MTN",
    reference: "REF-007",
    fulfilledTo: "08064567891",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_purchase",
    phoneNumber: "08064567891",
    network: "MTN",
  },
  {
    transactionId: "tx008",
    userId: "user3",
    amount: 2500,
    currency: "NGN",
    status: "pending",
    provider: "Airtel",
    reference: "REF-008",
    fulfilledTo: "08124567891",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "data_purchase",
    phoneNumber: "08124567891",
    bundleId: "10GB_MONTHLY",
    network: "Airtel",
  },
  {
    transactionId: "tx009",
    userId: "user4",
    amount: 800,
    currency: "NGN",
    status: "completed",
    provider: "MTN",
    reference: "REF-009",
    fulfilledTo: "08094567891",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_to_cash",
    phoneNumber: "08094567891",
    network: "MTN",
  },
  {
    transactionId: "tx010",
    userId: "user5",
    amount: 100,
    currency: "USD",
    status: "failed",
    provider: "Deriv",
    reference: "REF-010",
    fulfilledTo: "CR22222",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "deriv_withdrawal",
    accountId: "CR22222",
  },
  {
    transactionId: "tx011",
    userId: "user1",
    amount: 750,
    currency: "NGN",
    status: "completed",
    provider: "Glo",
    reference: "REF-011",
    fulfilledTo: "08134567890",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_purchase",
    phoneNumber: "08134567890",
    network: "Glo",
  },
  {
    transactionId: "tx012",
    userId: "user2",
    amount: 1800,
    currency: "NGN",
    status: "completed",
    provider: "Airtel",
    reference: "REF-012",
    fulfilledTo: "08024567890",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "data_purchase",
    phoneNumber: "08024567890",
    bundleId: "5GB_WEEKLY",
    network: "Airtel",
  },
  {
    transactionId: "tx013",
    userId: "user3",
    amount: 1200,
    currency: "NGN",
    status: "failed",
    provider: "MTN",
    reference: "REF-013",
    fulfilledTo: "08184567890",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "airtime_to_cash",
    phoneNumber: "08184567890",
    network: "MTN",
  },
  {
    transactionId: "tx014",
    userId: "user4",
    amount: 400,
    currency: "USD",
    status: "completed",
    provider: "Deriv",
    reference: "REF-014",
    fulfilledTo: "CR98765",
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "deriv_deposit",
    accountId: "CR98765",
  },
];

const DashboardPage = () => {
  const getTransactionResponse = {
    success: false,
    data: transactions,
    error: {
      message: "Unable to get transactions.",
    },
  };

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

      <article className="flex-1 overflow-y-scroll rounded-2xl  pt-0">
        <header className="bg-white_dark-black-1  sticky top-0 left-0 z-3 flex items-center  justify-between rounded-lg p-2 py-6">
          <h2 className="">Recent Transactions</h2>
          <Link href="/">See More</Link>
        </header>

        <TransactionList transactionRes={getTransactionResponse} />
      </article>
    </>
  );
};

export default DashboardPage;
