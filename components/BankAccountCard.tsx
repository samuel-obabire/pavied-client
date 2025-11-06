"use client";

import { useState } from "react";
import Image from "next/image";
import { removeUserBankAccount } from "@/lib/actions/bank.action";
import { cn } from "@/lib/utils";
import ActionState, { type ActionStateType } from "./ActionState";
import BankIcon from "./BankIcon";

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
          "bg-accent dark:bg-white_dark-black-1 space-y-3  rounded-2xl px-2 py-4",
          {
            "text-secondary": selected,
            "bg-secondary/5": selected,
          },
        )}
      >
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <BankIcon bankCode={bankCode} />
            <span className="">{bankName}</span>
          </div>

          {showActive && !bankAccount.active ? (
            <span className="text-secondary bg-secondary/10 p-1 rounded-lg text-12-medium">
              Under review
            </span>
          ) : null}

          {removeable && bankAccount.active && (
            <span
              className="form-error text-12-regular cursor-default p-1"
              onClick={() => removeAccount(bankAccount)}
            >
              Remove
            </span>
          )}

          {selected && (
            <Image
              src="/assets/check-circle.svg"
              alt=""
              width={20}
              height={20}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-18-medium">{accountName}</span>
          <span className="text-12-regular">{accountNumber}</span>
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

      <AccountCard />
    </div>
  );
};

export default BankAccountCard;
