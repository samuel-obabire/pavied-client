import { ArrowDownRight, ArrowDownLeft } from "lucide-react";

import DerivCurrencyIcon from "./DerivCurrencyIcon";

export const exchangeRates = [
  {
    currency: "USD",
    deposit: 1500,
    withdrawal: 1500,
    name: "US Dollar",
  },
  {
    currency: "tUSDT",
    deposit: 1500,
    withdrawal: 1500,
    name: "Tether TRC20",
  },
  {
    currency: "eUSDT",
    deposit: 1500,
    withdrawal: 1500,
    name: "Tether ER20",
  },
  {
    currency: "USDC",
    deposit: 1500,
    withdrawal: 1500,
    name: "USD Coin",
  },
];

const ExchangeRateList = () => {
  // Todo: Convert Rate cards to table

  return (
    <article>
      <header className="mb-3">
        <h2>Pavied dollar exchange rate</h2>
      </header>

      <div className="">
        {[exchangeRates[0]].map((accountRate) => (
          <ExchangeRateCard
            key={accountRate.currency}
            accountRate={accountRate}
          />
        ))}
      </div>
    </article>
  );
};

const ExchangeRateCard = ({
  accountRate,
}: {
  accountRate: (typeof exchangeRates)[0];
}) => {
  const { deposit, withdrawal, name, currency } = accountRate;

  return (
    <div className="bg-white_dark-black-1 text-12-medium md:text-14-medium grow-0 space-y-3 rounded-lg p-2">
      <div className="border-black-1 text-14-medium dark:border-accent flex gap-2 border-b py-3">
        <DerivCurrencyIcon currency={currency} /> {name}
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <ArrowDownRight className="text-success bg-white_dark-black-2 rounded-full p-1" />
          Deposit Rate:
        </div>
        ₦ {deposit}
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <ArrowDownLeft className="bg-white_dark-black-2 rounded-full p-1 text-[#A83A34]" />{" "}
          Withdrawal Rate:
        </div>
        ₦ {withdrawal}
      </div>
    </div>
  );
};

export default ExchangeRateList;
