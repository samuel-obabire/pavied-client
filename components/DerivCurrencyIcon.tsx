import Image from "next/image";
import React from "react";

import { derivAcccounts } from "@/lib/constants";

const DerivCurrencyIcon = ({ currency }: { currency: Currency }) => {
  const { icon } = derivAcccounts.find(
    (derivCurrency) => currency === derivCurrency.currency
  )!;

  return (
    <div className="relative size-6">
      <Image src={icon} fill alt={currency} />
    </div>
  );
};

export default DerivCurrencyIcon;
