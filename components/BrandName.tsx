import Image from "next/image";

const BrandName = () => {
  return (
    <div className="text-32-normal font-federo text-primary dark:text-white">
      <span className="relative left-1">Pa</span>
      <span className="relative inline-block h-10 w-9 ">
        <Image
          className="absolute top-[3px]  left-2"
          src="/assets/pavied-mark.svg"
          width={60.61}
          height={33.8}
          alt="check-mark"
        />
      </span>
      <span className="relative right-2">ied</span>
    </div>
  );
};

export default BrandName;
