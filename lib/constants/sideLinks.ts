import {
    LayoutDashboard,
    Logs,
    Settings,
    Wallet,
    WalletCards,
} from "lucide-react";

import { ROUTES } from "./routes";

export const sideLinks = [
  { label: "Dashboard", Icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Transactions", Icon: Logs, href: ROUTES.TRANSACTIONS },
  {
    deposit: {
      label: "Deposit",
      Icon: WalletCards,
      href: ROUTES.DERIV.DEPOSIT,
    },
    withdrawal: {
      label: "Withdrawal",
      Icon: WalletCards,
      href: ROUTES.DERIV.WITHDRAWAL,
    },
  },
  { label: "Deriv Account", Icon: Wallet, href: ROUTES.SETUP_DERIV },
  { label: "Bank Account", Icon: WalletCards, href: ROUTES.SETUP_BANK },
  { label: "Settings", Icon: Settings, href: ROUTES.SETTINGS_BIO },
];
