import { Skeleton } from "@/components/ui/skeleton";

const BioSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Whatsapp Number */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default BioSkeleton;
