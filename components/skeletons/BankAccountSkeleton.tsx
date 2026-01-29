import { Skeleton } from "@/components/ui/skeleton";

const BankAccountCardSkeleton = () => {
  return (
    <div className="bg-white_dark-black-2 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="h-4 w-12 rounded" />
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col items-end space-y-1.5">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
};

export default BankAccountCardSkeleton;
