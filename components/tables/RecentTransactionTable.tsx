"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCustomDate,
  formatNairaAmount,
  getTransactionDetailsByType,
} from "@/lib/utils";

import StatusBadge from "../StatusBadge";

const RecentTransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Table className="border-separate border-spacing-x-4 max-sm:w-auto max-sm:table-auto">
      <TableHeader className="bg-accent text-16-bold  dark:bg-black-2">
        <TableRow>
          <TableHead className="px-4">S/N</TableHead>
          <TableHead className="px-4">Transaction Type</TableHead>
          <TableHead className="px-4">Amount</TableHead>
          <TableHead className="px-4">Transaction Date</TableHead>
          <TableHead className="px-4 text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => {
          const { label: transactionType } =
            getTransactionDetailsByType(transaction);

          return (
            <TableRow
              key={transaction.transactionId}
              onClick={() => console.log(transaction.amount)}
            >
              <TableCell className="p-4">{index + 1}</TableCell>

              <TableCell className="p-4">{transactionType}</TableCell>

              <TableCell className="p-4">
                {formatNairaAmount(transaction.amount)}
              </TableCell>

              <TableCell className="p-4">
                {formatCustomDate(transaction.createdAt)}
              </TableCell>

              <TableCell className="p-4 text-right">
                <StatusBadge variant={transaction.status}>
                  {transaction.status}
                </StatusBadge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RecentTransactionsTable;
