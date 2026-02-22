import BioSkeleton from "@/components/skeletons/BioSkeleton";

const BioLoading = () => {
  return (
    <div className="max-w-2xl bg-white_dark-black-1 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200/30">
      <BioSkeleton />
    </div>
  );
};

export default BioLoading;
