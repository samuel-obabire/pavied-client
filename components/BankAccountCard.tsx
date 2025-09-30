"use client";

import { useState } from "react";

import { removeUserBankAccount } from "@/lib/actions/bank.action";

import ActionState, { ActionStateType } from "./ActionState";
import BankIcon from "./BankIcon";

const BankAccountCard = ({ bankAccount }: { bankAccount: BankAccount }) => {
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
        className="bg-accent dark:bg-black-2 mx-2  space-y-3 rounded-lg p-3"
      >
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <BankIcon bankCode={bankCode} />
            <span className="">{bankName}</span>
          </div>

          <span
            className="form-error text-12-regular cursor-default p-1"
            onClick={() => removeAccount(bankAccount)}
          >
            Remove
          </span>
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
