import { getDerivAccount } from "@/lib/utils/deriv";

import DerivCurrencyIcon from "./DerivCurrencyIcon";

const DerivAccountCard = ({ derivAccount }: { derivAccount: DerivAccount }) => {
  const { accountId, currency, dateAdded } = derivAccount;

  const currencyName = getDerivAccount(currency).name;

  return (
    <>
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
        </div>

        <div className="flex items-center justify-between">
          <span className="text-18-medium">{accountId}</span>
          <div className="flex flex-col">
            <span className="text-14-medium self-end">Date added</span>
            <span className="text-12-regular">{dateAdded!.toDateString()}</span>
          </div>
        </div>
      </div>
      )
    </>
  );
};

export default DerivAccountCard;
