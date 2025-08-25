/* eslint-disable no-unused-vars */
export const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  SETUP_DERIV: "/settings/deriv",
  SETUP_BANK: "/settings/bank",
} as const;

export const derivAcccounts = [
  {
    currency: "USD",
    icon: "/assets/usd-currency.svg",
    name: "US Dollar",
  },
  {
    currency: "tUSDT",
    icon: "/assets/usdt-currency.svg",
    name: "Tether TRC20",
  },
  {
    currency: "USDC",
    icon: "/assets/usdc-currency.svg",
    name: "USD Coin",
  },
] as const;

export enum DbCollections {
  USERS = "users",
  BANK_ACCOUNTS = "bank-accounts",
  DERIV_ACCOUNTS = "deriv-accounts",
}
