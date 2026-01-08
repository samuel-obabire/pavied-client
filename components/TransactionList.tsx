import DataRenderer from "./DataRenderer";
import MobileTransactionList from "./MobileTransactionList";
import RecentTransactionsTable from "./tables/RecentTransactionTable";

const TransactionList = ({
  transactionRes,
}: {
  transactionRes: ActionResponse<Transaction[]>;
}) => {
  return (
    <div className="bg-white dark:bg-black-2 flex min-h-[100px] flex-col space-y-4 rounded-xl border border-black-1/5 p-4 shadow-sm dark:border-white/5">
      <DataRenderer
        data={transactionRes.data}
        success={transactionRes.success}
        error={transactionRes.error}
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
