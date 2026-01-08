"use client";

import Image from "next/image";
import { removeDerivAccount } from "@/lib/actions/deriv.action";
import { cn } from "@/lib/utils";
import { getDerivAccount } from "@/lib/utils/deriv";
import DerivCurrencyIcon from "./DerivCurrencyIcon";

const DerivAccountCard = ({
  derivAccount,
  selected,
  showContext,
  showActive,
}: {
  derivAccount: DerivAccount;
  selected?: boolean;
  showContext?: boolean;
  showActive?: boolean;
}) => {
  const { accountId, currency, dateAdded, active } = derivAccount;

  const currencyName = getDerivAccount(currency)?.name;

  return (
    <div
      key={`${accountId}_${dateAdded}`}
      className={cn(
        "group relative overflow-hidden bg-white_dark-black-2 border border-gray-100 dark:border-gray-800 rounded-xl p-4 transition-all duration-500 hover:shadow-md  hover:-translate-y-0.5",
        {
          "ring-2 ring-secondary/30 border-secondary/50 bg-secondary/[0.02] shadow-md":
            selected,
        }
      )}
    >
      {/* Decorative focal point */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-secondary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50/50 dark:bg-white/5 border border-gray-100/50 dark:border-gray-800/50 shadow-sm group-hover:scale-105 transition-transform duration-500">
            <DerivCurrencyIcon currency={currency} />
          </div>
          <span className="text-13-medium text-gray-500 dark:text-gray-400">
            {currencyName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selected && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10 border border-secondary/20">
              <Image
                src="/assets/check-circle.svg"
                alt="selected"
                width={14}
                height={14}
              />
            </div>
          )}

          {showActive && !active && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
              Under review
            </span>
          )}

          {showContext && active && (
            <span
              className="transition-all duration-300 text-[11px] font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-800"
              onClick={(e) => {
                e.stopPropagation();
                removeDerivAccount(derivAccount);
              }}
            >
              Remove
            </span>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
            Account ID
          </span>
          <span className="text-16-bold text-black-1_dark-white tracking-tight leading-none">
            {accountId}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
            Date Added
          </span>
          <span className="text-13-medium text-gray-600 dark:text-gray-300">
            {dateAdded!.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DerivAccountCard;
