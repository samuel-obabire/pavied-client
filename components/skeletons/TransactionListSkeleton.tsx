import { Skeleton } from "@/components/ui/skeleton";
import DataTableSkeleton from "@/components/tables/DataTableSkeleton";

const TransactionListSkeleton = () => {
  return (
    <div className="bg-white dark:bg-black-2 flex min-h-[100px] flex-col space-y-4 rounded-xl border border-black-1/5 p-4 shadow-sm dark:border-white/5">
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="max-md:hidden">
        <DataTableSkeleton columns={5} rows={5} />
      </div>
    </div>
  );
};

export default TransactionListSkeleton;
