"use client";
import { Info } from "lucide-react";
import CountUp from "react-countup";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type StatsCardProps = {
  title: string;
  subText: string;
  description?: string;
  count: number;
  prefix?: string;
  decimals?: number;
};

const StatsCard = ({
  title,
  subText,
  count,
  description,
  prefix = "",
  decimals = 0,
}: StatsCardProps) => {
  return (
    <div className="bg-white dark:bg-black-2 flex flex-1 flex-col gap-3 rounded-xl border border-black-1/5 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:shadow-white/10">
      <div className="flex items-center justify-between">
        <span className="text-14-medium text-black-1/60 dark:text-white/60">
          {title}
        </span>

        <Tooltip>
          <TooltipTrigger>
            <div className="rounded-full bg-secondary/10 p-1.5 transition-colors hover:bg-secondary/20">
              <Info className="text-secondary size-3.5" />
            </div>
          </TooltipTrigger>
          {description && (
            <TooltipContent className="bg-white_dark-black-1 border-black-1/10 shadow-md dark:border-white/10">
              <p className="max-w-[200px] text-xs leading-relaxed">
                {description}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-28-bold text-black-1 dark:text-white">
          <CountUp
            end={count}
            separator=","
            prefix={prefix}
            decimals={decimals}
          />
        </span>
        <span className="text-12-medium text-black-1/40 dark:text-white/40 truncate">
          {subText}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
