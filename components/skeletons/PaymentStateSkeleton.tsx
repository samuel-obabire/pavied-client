import { Skeleton } from "@/components/ui/skeleton";

const PaymentStateSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 pt-10">
      <Skeleton className="size-24 rounded-full" />
      <div className="space-y-2 text-center w-full max-w-sm">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default PaymentStateSkeleton;
