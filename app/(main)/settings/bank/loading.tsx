import BankAccountCardSkeleton from "@/components/skeletons/BankAccountSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-white_dark-black-1 rounded-2xl p-6 shadow-md dark:shadow-gray-200/15 border border-gray-200/30">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-[78px] w-full rounded-xl" />
            <Skeleton className="h-[78px] w-full rounded-xl" />
            <Skeleton className="h-[78px] w-full rounded-xl" />
          </div>

          <Skeleton className="h-24 w-full rounded-xl" />

          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </section>

      <section className="bg-white_dark-black-1 rounded-2xl p-6 shadow-md dark:shadow-gray-200/15 border border-gray-200/30 space-y-6">
        <Skeleton className="h-7 w-56" />

        <div className="space-y-2 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <BankAccountCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
