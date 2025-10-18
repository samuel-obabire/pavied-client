import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getDerivTransactionDetails } from "./deriv";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const calculatePaymentExpiry = (createdAt: Date, limitMinutes = 10) => {
  const created = new Date(createdAt);

  const now = new Date();
  const limitMs = limitMinutes * 60 * 1000;
  const expiresAt = new Date(created.getTime() + limitMs);
  const remainingMs = Math.max(expiresAt.getTime() - now.getTime(), 0);

  const isExpired = remainingMs === 0;

  // Format remaining time as "mm:ss"
  const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const remainingText = `${minutes}:${seconds}`;

  return {
    isExpired,
    remainingMs,
    remainingText,
    expiresAt,
  };
};

type DerivError = {
  code: string;
  message: string;
};

export const isDerivError = (error: unknown): error is DerivError => {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  );
};
