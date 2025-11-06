"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const renderMenu = (derivAccount: DerivAccount) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>···</DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="bg-white_dark-black-1">
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => removeDerivAccount(derivAccount)}
            className="text-failed cursor-pointer"
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      key={`${accountId}_${dateAdded}`}
      className={cn(
        "bg-accent dark:bg-white_dark-black-1 space-y-3  rounded-2xl px-2 py-4",
        {
          "text-secondary": selected,
          "bg-secondary/5": selected,
        },
      )}
    >
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <DerivCurrencyIcon currency={currency} />
          <span className="">{currencyName}</span>
        </div>

        {selected && (
          <Image src="/assets/check-circle.svg" alt="" width={20} height={20} />
        )}

        {showActive && !active ? (
          <span className="text-secondary bg-secondary/10 p-1 rounded-lg text-12-medium">
            Under review
          </span>
        ) : null}
        {showContext && renderMenu(derivAccount)}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-18-medium">{accountId}</span>
        <div className="flex flex-col gap-2">
          <span className="text-14-medium self-end">Date added</span>
          <span className="text-12-regular opacity-75">
            {dateAdded!.toDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DerivAccountCard;
