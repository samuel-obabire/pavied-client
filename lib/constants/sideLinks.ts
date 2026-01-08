import {
    LayoutDashboard,
    Logs,
    Settings, WalletCards
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
  { label: "Settings", Icon: Settings, href: ROUTES.SETTINGS_BIO },
];
