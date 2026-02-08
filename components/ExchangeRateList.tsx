import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import DataRenderer from "./DataRenderer";
import DerivCurrencyIcon from "./DerivCurrencyIcon";

const ExchangeRateList = ({
  rateRes,
}: {
  rateRes: ActionResponse<CurrencyConfig[]>;
}) => {
  return (
    <article>
      <header className="mb-3">
        <h2>Exchange rates</h2>
      </header>

      <div className="no-scrollbar  card-border  flex gap-6 overflow-x-scroll rounded-lg pb-4 lg:flex-col">
        <DataRenderer
          success={rateRes.success}
          data={rateRes.data}
          error={rateRes.error}
          render={(rates) => {
            return rates
              .filter((rate) => rate.active)
              .map((rate) => (
                <ExchangeRateCard key={rate.code} accountRate={rate} />
              ));
          }}
        />
      </div>
    </article>
  );
};

const ExchangeRateCard = ({ accountRate }: { accountRate: CurrencyConfig }) => {
  const { depositRate, withdrawalRate, name, code } = accountRate;

  return (
    <div className="bg-white_dark-black-1 text-12-medium md:text-14-medium w-[258px] shrink-0 grow-0 space-y-3 rounded-lg p-2">
      <div className="border-black-1 text-14-medium dark:border-accent flex gap-2 border-b py-3">
        <DerivCurrencyIcon currency={code} /> {name}
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <ArrowDownRight className="text-success bg-white_dark-black-2 rounded-full p-1" />
          Deposit Rate:
        </div>
        ₦ {formatNumber(depositRate)}
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <ArrowDownLeft className="bg-white_dark-black-2 rounded-full p-1 text-[#A83A34]" />{" "}
          Withdrawal Rate:
        </div>
        ₦ {formatNumber(withdrawalRate)}
      </div>
    </div>
  );
};

export default ExchangeRateList;
