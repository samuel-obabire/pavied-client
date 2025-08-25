import Image from "next/image";
import React from "react";

import { nigeriaBanks } from "@/lib/constants";

const BankIcon = ({ bankCode }: { bankCode: string }) => {
  const { icon } = nigeriaBanks.find(({ code }) => bankCode === code)!;

  return (
    <div className="relative size-6">
      <Image src={icon} fill alt="bank" />
    </div>
  );
};

export default BankIcon;
