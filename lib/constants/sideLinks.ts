import { LayoutDashboard, Logs, Wallet, WalletCards } from "lucide-react";

import { ROUTES } from "./routes";

export const sideLinks = [
  { label: "Dashboard", Icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Orders", Icon: Logs, href: ROUTES.ORDERS },
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
];
