import DataRenderer from "./DataRenderer";
import TransactionCard from "./TransactionCard";

const TransactionList = ({
  transactionRes,
}: {
  transactionRes: ActionResponse<Transaction[]>;
}) => {
  return (
    <div className="bg-white_dark-black-1 min-h-[300px] flex-col space-y-4 p-2">
      <DataRenderer
        data={transactionRes.data}
        success={transactionRes.success}
        error={transactionRes.error}
        render={(transactions) => {
          return transactions.map((transaction) => {
            return (
              <TransactionCard
                key={transaction.transactionId}
                transaction={transaction as Transaction}
              />
            );
          });
        }}
      />
    </div>
  );
};

export default TransactionList;
