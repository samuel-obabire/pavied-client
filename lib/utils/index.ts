import { type ClassValue, clsx } from "clsx";
import Decimal from "decimal.js";
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
  const monthPart = date.toLocaleString("en-US", { month: "short" });
  const yearPart = date.getFullYear();

  return `${timePart} • ${dayPart} ${monthPart} ${yearPart}`;
};

export const formatDateTime = (inputDate: Date) => {
  const date = new Date(inputDate);

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const period = date.getHours() >= 12 ? "PM" : "AM";

  // return { date: dateStr, time: timeStr, period };

  return `${dateStr} at ${timeStr} ${period}`;
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

export const formatNairaAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const sanitizeTwoDecimals = (value: string) => {
  // keep only digits + one decimal
  const newValue = value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");

  // limit decimal to 2 places if present
  const parts = value.split(".");
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
    return parts.join(".");
  }

  return newValue;
};

export const truncateTo2 = (value: string | number): string => {
  if (value === "" || value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return "";

  return new Decimal(num).toDecimalPlaces(2, Decimal.ROUND_DOWN).toString();
};

export const multiplyNumbers = (a: number, b: number) => {
  return new Decimal(a).times(b).toDecimalPlaces(2).toNumber();
};

export const divideNumbers = (a: number, b: number, dp = 2) => {
  return new Decimal(a)
    .div(b)
    .toDecimalPlaces(dp, Decimal.ROUND_DOWN)
    .toNumber();
};

export const isSameRate = (
  a: number,
  b: number,
  tolerance = 0.0001,
): boolean => {
  return Math.abs(a - b) <= tolerance;
};

export const isWithinLimit = (value: number, min: number, max: number) => {
  if (value < min || value > max) return false;
  return true;
};
