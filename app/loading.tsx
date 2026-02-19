import BrandName from "@/components/BrandName";

export default function Loading() {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 h-screen w-screen bg-white dark:bg-black-1">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-48 w-48 animate-spin rounded-full border-4 border-gray-200 border-t-primary dark:border-gray-800 dark:border-t-white" />
        <BrandName />
      </div>
    </div>
  );
}
