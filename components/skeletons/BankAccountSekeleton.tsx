const BankAccountCardSkeleton = () => {
  return (
    <div className="bg-accent dark:bg-white_dark-black-1 space-y-3 rounded-2xl px-2 py-4 animate-pulse">
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default BankAccountCardSkeleton;
