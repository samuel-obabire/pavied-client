import { cn } from "@/lib/utils";

const InfoCard = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className="rounded-lg bg-[#E2A7040D] p-2">
      <p
        className={cn(
          "text-12-regular sm:text-14-regular text-secondary",
          className
        )}
      >
        {message}
      </p>
    </div>
  );
};

export default InfoCard;
