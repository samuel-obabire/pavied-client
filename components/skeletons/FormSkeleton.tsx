import { Skeleton } from "@/components/ui/skeleton";

const FormSkeleton = () => {
  return (
    <div className="bg-white dark:bg-black-2 space-y-6 rounded-2xl p-6 shadow-md border border-gray-200/30 dark:border-white/10 dark:shadow-white/5">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default FormSkeleton;
