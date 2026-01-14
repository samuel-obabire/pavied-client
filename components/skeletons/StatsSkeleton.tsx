import { Skeleton } from "@/components/ui/skeleton";

const StatsCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-black-2 flex flex-1 flex-col gap-3 rounded-xl border border-black-1/5 p-5 shadow-sm dark:border-white/10 dark:shadow-white/10">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-8 rounded-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
};

const StatsSkeleton = () => {
  return (
    <div className="grid flex-none grid-cols-2 gap-2 sm:gap-4 xl:flex">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>
  );
};

export default StatsSkeleton;
