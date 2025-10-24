"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/table-core";
import { useQueryStates } from "nuqs";
import { use } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paginationParsers } from "@/lib/utils/parsers";

interface TransactionTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Promise<ActionResponse<TData[]>>;
}

const paginationUrlKeys = {
  pageIndex: "page",
  pageSize: "perPage",
};

const TransactionTable = <TData, TValue>({
  columns,
  data,
}: TransactionTableProps<TData, TValue>) => {
  const [pagination, setPagination] = useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
    shallow: false,
  });

  const { data: tableData, error } = use(data);

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: -1,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive flex h-32 items-center justify-center rounded-md border">
        {error.message || "Something went wrong while loading data."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white_dark-black-1 overflow-hidden rounded-md ">
        <Table className="rounded-2xl">
          <TableHeader className="bg-accent   text-16-bold dark:bg-black-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-none" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-black-1 font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  className={`${i % 2 === 0 ? "" : "bg-accent dark:bg-black-2"} hover:bg-secondary/5 dark:hover:bg-black-3 cursor-pointer border-0  transition-colors`}
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || !tableData?.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionTable;
