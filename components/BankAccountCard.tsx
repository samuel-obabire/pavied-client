"use client";

import { useState } from "react";
import Image from "next/image";
import { removeUserBankAccount } from "@/lib/actions/bank.action";
import { cn } from "@/lib/utils";
import type { BankAccount } from "@/prisma/lib/generated/prisma/browser";
import ActionState, { type ActionStateType } from "./ActionState";
import BankIcon from "./BankIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

const BankAccountCard = ({
  bankAccount,
  selected,
  removeable = true,
  showActive,
}: {
  bankAccount: BankAccount;
  selected?: boolean;
  showActive?: boolean;
  removeable?: boolean;
}) => {
  const [actionState, setActionState] = useState<ActionStateType>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { accountName, accountNumber, bankCode, bankName } = bankAccount;

  const removeAccount = async (bankAccount: BankAccount) => {
    try {
      setActionState("pending");

      const response = await removeUserBankAccount(bankAccount);

      if (response.success) {
        setActionState("success");
      } else {
        setErrorMessage(response.error?.message || "Something went wrong");
        setActionState("error");
      }
    } catch {
      setErrorMessage("Something went wrong");
      setActionState("error");
    }
  };

  const AccountCard = () => {
    return (
      <div
        key={`${accountNumber}_${bankCode}`}
        className={cn(
          "group relative overflow-hidden bg-white_dark-black-2 border border-gray-100 dark:border-gray-800 rounded-xl p-4 transition-all duration-500 hover:shadow-md hover:-translate-y-0.5",
          {
            "ring-2 ring-inset ring-secondary/30 border-secondary/50 bg-secondary/[0.02] shadow-md":
              selected,
          },
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50/50 dark:bg-white/5 border border-gray-100/50 dark:border-gray-800/50 shadow-sm group-hover:scale-105 transition-transform duration-500">
              <BankIcon bankCode={bankCode} />
            </div>
            <span className="text-13-medium text-gray-500 dark:text-gray-400 capitalize">
              {bankName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showActive && !bankAccount.active && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                Under review
              </span>
            )}

            {removeable && bankAccount.active && (
              <Button
                className=" transition-all duration-300 text-[11px] font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmOpen(true);
                }}
              >
                Remove
              </Button>
            )}

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
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
              Account Holder
            </span>
            <span className="text-16-bold text-black-1_dark-white tracking-tight leading-none">
              {accountName}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
              Account Number
            </span>
            <span className="text-14-medium font-mono text-gray-700 dark:text-gray-300">
              {accountNumber}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <ActionState
        pendingTitle="Removing Account"
        state={actionState}
        errorMessage={errorMessage}
        retryAction={() => removeAccount(bankAccount)}
        successTitle="Account Successfully removed"
      />

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-white_dark-black-1 w-[90%] !max-w-[400px] border-0 shadow-sm outline-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-18-bold text-black-1_dark-white">
              Remove Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-14-medium text-gray-500">
              Are you sure you want to remove this account? Additional
              confirmation may be required to link it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel className="mt-0 btn-ghost text-black-1_dark-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-danger bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={(e) => {
                e.preventDefault();
                setIsConfirmOpen(false);
                removeAccount(bankAccount);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AccountCard />
    </div>
  );
};

export default BankAccountCard;
