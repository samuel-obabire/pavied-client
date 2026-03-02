import { fetchCachedRates } from "@/lib/actions/rate.action";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const ExchangeRatesSkeleton = () => (
  <div className="flex-1 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black-2">
    <div className="mb-4 h-6 w-32 animate-pulse rounded-md bg-accent"></div>
    <div className="flex flex-col gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex h-[88px] animate-pulse items-center justify-between rounded-lg bg-accent/50 p-4"></div>
      ))}
    </div>
  </div>
);

const ExchangeRates = async () => {
  const { data: rates } = await fetchCachedRates();

  if (!rates || rates.length === 0) return null;

  return (
    <article className="flex-1 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black-2">
      <h2 className="mb-4 text-18-bold text-black-1 dark:text-white">Exchange Rates</h2>
      
      <div className="flex flex-col gap-3">
        {rates.map((rate) => (
          <div 
            key={rate.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-black-1/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-16-bold text-secondary">
                {rate.code}
              </div>
              <div>
                <p className="text-14-medium text-black-1 dark:text-white">{rate.name}</p>
                <p className="text-12-regular text-gray-500">Live Rate</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <ArrowDownLeft className="size-3 text-success" />
                <span className="text-14-medium text-success">
                  Buy: ₦{rate.depositRate.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="size-3 text-failed" />
                <span className="text-14-medium text-failed">
                  Sell: ₦{rate.withdrawalRate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ExchangeRates;
