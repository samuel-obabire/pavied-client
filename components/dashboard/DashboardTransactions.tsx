import Link from "next/link";
import TransactionList from "@/components/TransactionList";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";

const DashboardTransactions = async ({ userId }: { userId: string }) => {
  const transactionRes = getUserTransactions(userId);

  return (
    <article className="mt-8 flex-1 overflow-visible rounded-2xl pt-0">
      <header className="sticky top-0 left-0 z-10 mb-4 flex items-center justify-between px-2 py-2 bg-white_dark-black-1">
        <h2 className="text-20-medium text-black-1 dark:text-white">Recent Transactions</h2>
        <Link 
          href={ROUTES.TRANSACTIONS}
          className="text-14-medium text-secondary transition-opacity hover:opacity-80"
        >
          View all
        </Link>
      </header>

      <TransactionList transactionRes={transactionRes} />
    </article>
  );
};

export default DashboardTransactions;
