import BankAccountCardSkeleton from "./skeletons/BankAccountSkeleton";

const AccountCardFallback = () => {
  return (
    <div className="space-y-2 pt-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <BankAccountCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default AccountCardFallback;
