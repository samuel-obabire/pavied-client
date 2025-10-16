import Link from "next/link";

import StatsCard from "@/components/StatsCard";
import TransactionList from "@/components/TransactionList";

const transactions: Transaction[] = [
  {
    transactionId: "txn_0301",
    userId: "user_001",
    amount: 15000,
    status: "success",
    type: "deriv_deposit",
    assignedBank: {
      bankName: "moniepoint bank",
      accountNumber: "00000000",
      acountName: "Evarest Direct Technologies",
    },
    createdAt: new Date("2025-10-01T10:00:00Z"),
    updatedAt: new Date("2025-10-01T10:30:00Z"),
    fulfillment: {
      fulfilled: true,
      fulfilledAt: new Date("2025-10-01T10:25:00Z"),
      actorId: "admin_01",
      referenceId: "ref_1001",
      note: "Deposit confirmed via bank transfer.",
    },
    extra: {
      currency: "USD",
      derivLoginId: "CR12345",
      paidFromBankName: "Access Bank",
      paidFromBankCode: "044",
      paidFromAccountName: "Samuel",
      paidFromAccountNumber: "0123456789",
      recieptPath: "https://example.com/receipts/txn_001.png",
    },
  },
  {
    transactionId: "txn_0051",
    userId: "user_001",
    amount: 15000,
    status: "success",
    type: "deriv_deposit",
    assignedBank: {
      bankName: "moniepoint bank",
      accountNumber: "00000000",
      acountName: "Evarest Direct Technologies",
    },
    createdAt: new Date("2025-10-01T10:00:00Z"),
    updatedAt: new Date("2025-10-01T10:30:00Z"),
    fulfillment: {
      fulfilled: true,
      fulfilledAt: new Date("2025-10-01T10:25:00Z"),
      actorId: "admin_01",
      referenceId: "ref_1001",
      note: "Deposit confirmed via bank transfer.",
    },
    extra: {
      currency: "USD",
      derivLoginId: "CR12345",
      paidFromBankName: "Access Bank",
      paidFromBankCode: "044",
      paidFromAccountNumber: "0123456789",
      paidFromAccountName: "Samuel",
      recieptPath: "https://example.com/receipts/txn_001.png",
    },
  },
  {
    transactionId: "txn_0101",
    userId: "user_001",
    amount: 15000,
    status: "failed",
    type: "deriv_deposit",
    assignedBank: {
      bankName: "moniepoint bank",
      accountNumber: "00000000",
      acountName: "Evarest Direct Technologies",
    },
    createdAt: new Date("2025-10-01T10:00:00Z"),
    updatedAt: new Date("2025-10-01T10:30:00Z"),
    fulfillment: {
      fulfilled: true,
      fulfilledAt: new Date("2025-10-01T10:25:00Z"),
      actorId: "admin_01",
      referenceId: "ref_1001",
      note: "Deposit confirmed via bank transfer.",
    },
    extra: {
      currency: "USD",
      derivLoginId: "CR12345",
      paidFromBankName: "Access Bank",
      paidFromBankCode: "044",
      paidFromAccountNumber: "0123456789",
      paidFromAccountName: "Samuel",
      recieptPath: "https://example.com/receipts/txn_001.png",
    },
  },
  {
    transactionId: "txen_002",
    userId: "user_002",
    amount: 5000,
    status: "pending",
    type: "deriv_withdrawal",
    createdAt: new Date("2025-10-02T11:00:00Z"),
    updatedAt: new Date("2025-10-02T11:10:00Z"),
    fulfillment: {
      fulfilled: false,
      fulfilledAt: new Date("2025-10-02T11:00:00Z"),
      note: "Awaiting bank confirmation.",
    },
    extra: {
      currency: "USD",
      derivLoginId: "CR67890",
      receivingBankAccountNumber: "1234567890",
      recievingBankAccountName: "John Doe",
      receivingBankCode: "058",
      receivingBankName: "GTBank",
    },
  },
  {
    transactionId: "txn_003",
    userId: "user_003",
    amount: 1000,
    status: "success",
    type: "airtime_purchase",
    createdAt: new Date("2025-10-03T12:00:00Z"),
    updatedAt: new Date("2025-10-03T12:05:00Z"),
    fulfillment: {
      fulfilled: true,
      fulfilledAt: new Date("2025-10-03T12:03:00Z"),
      actorId: "system_auto",
      referenceId: "airtime_ref_321",
    },
    extra: {
      phoneNumber: "08031234567",
      network: "MTN",
    },
  },
];

const DashboardPage = () => {
  const getTransactionResponse = {
    success: true,
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
