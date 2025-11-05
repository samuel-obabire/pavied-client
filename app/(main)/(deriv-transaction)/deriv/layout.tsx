import type { ReactNode } from "react";
import ExchangeRateList from "@/components/ExchangeRateList";
import { fetchCachedRates } from "@/lib/actions/rate.action";

export default async function DerivTransactionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const rateRes = await fetchCachedRates();

  return (
    <div className="justify-around gap-4 space-y-6 overflow-y-auto min-sm:max-md:px-20 lg:flex">
      <div className="grow space-y-3 max-w-lg">{children}</div>

      <ExchangeRateList rateRes={rateRes} />
    </div>
  );
}
