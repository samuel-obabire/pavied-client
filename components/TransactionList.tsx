import DataRenderer from "./DataRenderer";
import MobileTransactionList from "./MobileTransactionList";
import RecentTransactionsTable from "./tables/RecentTransactionTable";

const TransactionList = ({
  transactionRes,
}: {
  transactionRes: ActionResponse<Transaction[]>;
}) => {
  return (
    <div className="bg-white_dark-black-1 min-h-[100px] flex-col space-y-4 p-2 rounded-lg">
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
