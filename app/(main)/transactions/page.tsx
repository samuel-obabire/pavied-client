import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsTimestamp,
  type SearchParams,
} from "nuqs/server";
import TransactionListSkeleton from "@/components/skeletons/TransactionListSkeleton";
import TransactionList from "@/components/TransactionList";
import { columns } from "@/components/tables/columns";
import DataTableSkeleton from "@/components/tables/DataTableSkeleton";
import TransactionTable from "@/components/tables/TransactionTable";
import { getUserTransactions } from "@/lib/actions/payment.action";
import { PER_PAGE } from "@/lib/constants";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const transactionsSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(PER_PAGE),
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
    <div className="space-y-2">
      <header className="h-[20px]">
        <h1 className="text-14-medium">Transaction history</h1>
      </header>
      {/* <TransactionFilter /> */}

      <div className="max-md:hidden">
        <Suspense fallback={<DataTableSkeleton columns={6} rows={8} />}>
          <TransactionTable columns={columns} data={transactionsPromise} />
        </Suspense>
      </div>

      <div className="md:hidden h-[calc(100dvh-116px)] overflow-y-scroll">
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList transactionRes={transactionsPromise} />
        </Suspense>
      </div>
    </div>
  );
};

export default TransactionPage;
