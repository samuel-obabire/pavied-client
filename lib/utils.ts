import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { derivAcccounts } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDerivAccount = (currency: Currency) => {
  return derivAcccounts.find(
    (derivCurrency) => currency === derivCurrency.currency
  )!;
};
