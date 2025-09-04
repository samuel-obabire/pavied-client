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

const getDerivTransactionDetails = (transaction: Transaction) => {
  return {
    label:
      transaction.type === "deriv_deposit"
        ? "Deriv deposit"
        : "Deriv withdrawal",
    icon: "/assets/bank-logos/palmpay.jpg",
  };
};

const getTransactionDetails = (transaction: Transaction) => {
  const transactionsDetailsType = {
    deriv_deposit: getDerivTransactionDetails,
    deriv_withdrawal: getDerivTransactionDetails,
  };

  const detailsFn =
    transactionsDetailsType[
      transaction.type as keyof typeof transactionsDetailsType
    ];
  if (detailsFn) {
    return detailsFn(transaction);
  }
  return { label: "Generic", icon: "/assets/deriv.png" };
};

export const getTransactionDetailsByType = (transaction: Transaction) => {
  const details = getTransactionDetails(transaction);

  return details;
};

export const formatCustomDate = (dateInput: Date | string): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // convert to 12h format

  const timePart = `${hours}:${minutes} ${ampm}`;
  const dayPart = date.getDate();
  const monthPart = date
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase();
  const yearPart = date.getFullYear();

  return `${timePart} • ${dayPart} ${monthPart} ${yearPart}`;
};
