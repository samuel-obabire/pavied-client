"use client";
import { Info } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type StatsCardProps = {
  title: string;
  subText: string;
  description?: string;
  count: number;
};

const StatsCard = ({ title, subText, count, description }: StatsCardProps) => {
  return (
    <div className="bg-white_dark-black-1 card-border  flex flex-1 flex-col gap-3 rounded-lg  p-4 ">
      <div className="flex  items-center justify-between">
        <span className="md:text-16-regular">{title}</span>

        <Tooltip>
          <TooltipTrigger>
            <Info className="text-secondary size-4" />
          </TooltipTrigger>
          {description && (
            <TooltipContent className="bg-white shadow-sm">
              <p className="bg-white text-wrap">{description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-24-bold">
          <CountUp end={count} />
        </span>
        <span className="text-12-regular md:text-16-regular truncate">
          {subText}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
