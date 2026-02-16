import { use } from "react";
import type { BaseTransaction } from "@/lib/prisma-adapters/types";
import DataRenderer from "./DataRenderer";
import MobileTransactionList from "./MobileTransactionList";
import RecentTransactionsTable from "./tables/RecentTransactionTable";

const TransactionList = ({
  transactionRes,
}: {
  transactionRes: Promise<ActionResponse<BaseTransaction[]>>;
}) => {
  const { data, success, error } = use(transactionRes);

  return (
    <div className="bg-white dark:bg-black-2 flex min-h-[100px] flex-col space-y-4 rounded-xl border border-black-1/5 p-4 shadow-sm dark:border-white/5">
      <DataRenderer
        data={data}
        success={success}
        error={error}
        render={(transactions) => {
          return (
            <>
              <MobileTransactionList transactions={transactions} />
              <RecentTransactionsTable transactions={transactions} />
            </>
          );
        }}
      />
    </div>
  );
};

export default TransactionList;
