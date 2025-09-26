import Image from "next/image";
import React from "react";

import { supportedDerivAccountsType } from "@/lib/constants/supportedDerivAccountsType";

const DerivCurrencyIcon = ({ currency }: { currency: string }) => {
  const { icon } = supportedDerivAccountsType.find(
    (derivCurrency) => currency === derivCurrency.currency
  )!;

  return (
    <div className="relative size-6">
      <Image src={icon} fill alt={currency} />
    </div>
  );
};

export default DerivCurrencyIcon;
