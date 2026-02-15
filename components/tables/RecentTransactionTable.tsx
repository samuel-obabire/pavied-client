"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants/routes";
import type { BaseTransaction } from "@/lib/prisma-adapters/types";
import {
  formatCustomDate,
  formatNairaAmount,
  getTransactionDetailsByType,
} from "@/lib/utils";
import StatusBadge from "../StatusBadge";

const RecentTransactionsTable = ({
  transactions,
}: {
  transactions: BaseTransaction[];
}) => {
  const router = useRouter();

  return (
    <Table className="border-black-1 max-md:hidden  w-full overflow-hidden rounded-2xl">
      <TableHeader className="bg-secondary/20 dark:bg-black-2">
        <TableRow className="overflow-hidden border-none">
          <TableHead className="border-black-1  rounded-l-2xl border-r px-4 py-3">
            S/N
          </TableHead>
          <TableHead className="border-black-1  border-r px-4 py-3">
            Transaction Type
          </TableHead>
          <TableHead className="border-black-1  border-r px-4 py-3">
            Amount
          </TableHead>
          <TableHead className="border-black-1  border-r px-4 py-3">
            Transaction Date
          </TableHead>
          <TableHead className="rounded-r-2xl px-4 py-3 text-right">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction, index) => {
          const { label: transactionType } =
            getTransactionDetailsByType(transaction);

          return (
            <TableRow
              key={`desktop-${transaction.transactionId}`}
              className="border-accent/10 hover:bg-secondary/10 dark:hover:bg-black-3 cursor-pointer border-b transition-colors"
              onClick={() =>
                router.push(
                  `${ROUTES.TRANSACTIONS}/${transaction.transactionId}`,
                )
              }
            >
              <TableCell className="px-4 py-3">{index + 1}</TableCell>
              <TableCell className="px-4 py-3">{transactionType}</TableCell>
              <TableCell className="px-4 py-3">
                {formatNairaAmount(transaction.amount)}
              </TableCell>
              <TableCell className="px-4 py-3">
                {formatCustomDate(transaction.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
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
