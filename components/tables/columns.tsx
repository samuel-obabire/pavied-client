"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ROUTES } from "@/lib/constants/routes";
import {
  formatCustomDate,
  formatNairaAmount,
  getTransactionDetailsByType,
} from "@/lib/utils";

import ExternalLink from "../ExternalLink";
import StatusBadge from "../StatusBadge";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "sn",
    header: "SN",
    cell: ({ row }) => row.index + 1,
  },
  {
    id: "type",
    header: "Transaction Type",
    cell: ({ row }) => {
      const { label: transactionType } = getTransactionDetailsByType(
        row.original
      );
      return transactionType;
    },
  },
  {
    id: "amount",
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatNairaAmount(row.original.amount)}
        </div>
      );
    },
  },
  {
    id: "date",
    header: () => <div className="">Transaction Date</div>,
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <div className="font-medium">{formatCustomDate(date)}</div>;
    },
  },

  {
    id: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="text-right">
          <StatusBadge variant={status}>{status}</StatusBadge>
        </div>
      );
    },
  },
  {
    id: "link",

    cell: ({ row }) => {
      const paymentId = row.original.transactionId;

      return <ExternalLink link={`${ROUTES.TRANSACTIONS}/${paymentId}`} />;
    },
  },
];
