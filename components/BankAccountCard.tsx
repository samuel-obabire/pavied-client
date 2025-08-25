"use client";

import { useRef, useState } from "react";

import { removeUserBankAccount } from "@/lib/actions/user.action";

import ActionState, { ActionStateType } from "./ActionState";
import BankIcon from "./BankIcon";

const BankAccountCard = ({ bankAccounts }: { bankAccounts: BankAccount[] }) => {
  const [actionState, setActionState] = useState<ActionStateType>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const bankAccountRef = useRef<null | BankAccount>(null);

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
      <>
        {bankAccounts.map((bankAccount) => {
          const { bankCode, accountName, accountNumber, bankName } =
            bankAccount;

          bankAccountRef.current = bankAccount;

          return (
            <div
              key={`${accountNumber}_${bankCode}`}
              className="bg-accent space-y-3  rounded-lg p-2"
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
        })}
      </>
    );
  };

  return (
    <div className="max-h-[300px] space-y-2 overflow-y-auto  max-sm:px-4 max-sm:pb-12">
      <ActionState
        pendingTitle="Removing Account"
        state={actionState}
        errorMessage={errorMessage}
        retryAction={() => removeAccount(bankAccountRef.current!)}
        successTitle="Account Successfully removed"
      />
      {bankAccounts.length ? (
        <AccountCard />
      ) : (
        <i className="block w-full text-center">No account added!</i>
      )}
    </div>
  );
};

export default BankAccountCard;
