import { LayoutDashboard, Logs, Wallet, WalletCards } from "lucide-react";

/* eslint-disable no-unused-vars */
export const ROUTES = {
  HOME: "/",
  REGISTER_BIO: "/settings/bio",
  SETUP_DERIV: "/settings/deriv",
  SETUP_BANK: "/settings/bank",
  DASHBOARD: "/dashboard",
  ONBOARD_BIO: "/onboarding/bio",
  ONBOARD_DERIV: "/onboarding/deriv",
  ONBOARD_BANK: "/onboarding/bank",
  ORDERS: "/orders",
};

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

export const nigeriaBanks = [
  {
    name: "Kuda Bank",
    code: "50211",
    icon: "/assets/bank-logos/kuda.jpg",
  },
  {
    name: "Moniepoint MFB",
    code: "090405",
    icon: "/assets/bank-logos/moniepoint.jpg",
  },
  {
    name: "OPay (Paycom)",
    code: "999992",
    icon: "/assets/bank-logos/opay.jpg",
  },
  {
    name: "PalmPay",
    code: "999991",
    icon: "/assets/bank-logos/palmpay.jpg",
  },
  {
    name: "Access Bank Plc",
    code: "044",
    icon: "/assets/bank-logos/access.jpg",
  },
  {
    name: "Fidelity Bank Plc",
    code: "070",
    icon: "/assets/bank-logos/fidelity.jpg",
  },
  {
    name: "First Bank of Nigeria",
    code: "011",
    icon: "/assets/bank-logos/firstbank.jpg",
  },
  {
    name: "First City Monument Bank (FCMB)",
    code: "214",
    icon: "/assets/bank-logos/fcmb.jpg",
  },
  {
    name: "Guaranty Trust Bank (GTBank)",
    code: "058",
    icon: "/assets/bank-logos/gtbank.jpg",
  },
  {
    name: "Union Bank of Nigeria",
    code: "032",
    icon: "/assets/bank-logos/union.jpg",
  },
  {
    name: "United Bank for Africa (UBA)",
    code: "033",
    icon: "/assets/bank-logos/uba.jpg",
  },
  {
    name: "Jaiz Bank Plc",
    code: "301",
    icon: "/assets/bank-logos/jaiz.jpg",
  },
  {
    name: "Providus Bank",
    code: "101",
    icon: "/assets/bank-logos/providus.jpg",
  },
  {
    name: "Parallex Bank",
    code: "104",
    icon: "/assets/bank-logos/parallex.jpg",
  },
  {
    name: "Zenith Bank Plc",
    code: "057",
    icon: "/assets/bank-logos/zenith.jpg",
  },
];

export enum DbCollections {
  USERS = "users",
  BANK_ACCOUNTS = "bank-accounts",
  DERIV_ACCOUNTS = "deriv-accounts",
}

export enum OnboardingStep {
  REGISTER = "bio",
  SETUP_DERIV = "deriv",
  SETUP_BANK = "bank",
  COMPLETE = "complete",
}

export const sideLinks = [
  { label: "Dashboard", Icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Orders", Icon: Logs, href: ROUTES.ORDERS },
  { label: "Deriv Account", Icon: Wallet, href: ROUTES.SETUP_DERIV },
  { label: "Bank Account", Icon: WalletCards, href: ROUTES.SETUP_BANK },
];
