import { redirect } from "next/navigation";
import {
  parseAsInteger,
  SearchParams,
  parseAsTimestamp,
  createLoader,
  parseAsString,
} from "nuqs/server";
import { Suspense } from "react";

import { columns } from "@/components/tables/columns";
import DataTableSkeleton from "@/components/tables/DataTableSkeleton";
import TransactionFilter from "@/components/tables/TransactionFilter";
import TransactionTable from "@/components/tables/TransactionTable";
import TransactionList from "@/components/TransactionList";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const transactionsSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  startDate: parseAsTimestamp,
  endDate: parseAsTimestamp,
  type: parseAsString,
  status: parseAsString,
};

const loadSearchParams = createLoader(transactionsSearchParams);

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const TransactionPage = async ({ searchParams }: PageProps) => {
  const query = await loadSearchParams(searchParams);

  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const transactionsPromise = getUserTransactions(user.id, query);

  return (
    <div className="">
      <TransactionFilter />

      <div className="max-md:hidden">
        <Suspense fallback={<DataTableSkeleton columns={6} rows={8} />}>
          <TransactionTable columns={columns} data={transactionsPromise} />
        </Suspense>
      </div>

      <div className="md:hidden">
        <TransactionList transactionRes={await transactionsPromise} />
      </div>
    </div>
  );
};

export default TransactionPage;
