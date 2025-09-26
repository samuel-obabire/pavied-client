"use client";

import { useRef, useState } from "react";

import { removeDerivAccount } from "@/lib/actions/deriv.action";
import { getDerivAccount } from "@/lib/utils/deriv";

import ActionState, { ActionStateType } from "./ActionState";
import DerivCurrencyIcon from "./DerivCurrencyIcon";

const DerivAccountCard = ({
  derivAccounts = [],
}: {
  derivAccounts: DerivAccount[];
}) => {
  const [actionState, setActionState] = useState<ActionStateType>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const derivAccountRef = useRef<null | DerivAccount>(null);

  const removeAccount = async (derivAccount: DerivAccount) => {
    try {
      setActionState("pending");

      const response = await removeDerivAccount(derivAccount);

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
        {derivAccounts.map((derivAccount) => {
          const { currency, dateAdded, accountId } = derivAccount;

          derivAccountRef.current = derivAccount;

          const currencyName = getDerivAccount(currency).name;

          return (
            <div
              key={`${accountId}_${dateAdded}`}
              className="bg-accent dark:bg-white_dark-black-2 space-y-3  rounded-lg p-2"
            >
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <DerivCurrencyIcon currency={currency} />
                  <span className="">{currencyName}</span>
                </div>

                <span
                  className="form-error text-12-regular cursor-default p-1"
                  onClick={() => removeAccount(derivAccount)}
                >
                  Remove
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-18-medium">{accountId}</span>
                <div className="flex flex-col">
                  <span className="text-14-medium self-end">Date added</span>
                  <span className="text-12-regular">
                    {dateAdded!.toDateString()}
                  </span>
                </div>
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
        retryAction={() => removeAccount(derivAccountRef.current!)}
        successTitle="Account Successfully removed"
      />
      {derivAccounts.length ? (
        <AccountCard />
      ) : (
        <i className="block w-full text-center">No account added!</i>
      )}
    </div>
  );
};

export default DerivAccountCard;
