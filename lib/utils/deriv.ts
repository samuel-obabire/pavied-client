import { supportedDerivAccountsType } from "../constants/supportedDerivAccountsType";
import type { BaseTransaction } from "../prisma-adapters/types";

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

export const getDerivAccount = (currency: string) => {
  return supportedDerivAccountsType.find(
    (derivAccount) => currency === derivAccount.currency,
  );
};

export const getDerivTransactionDetails = (transaction: BaseTransaction) => {
  return {
    label:
      transaction.type === "DERIV_DEPOSIT"
        ? "Deriv deposit"
        : "Deriv withdrawal",
    icon: "/assets/deriv.png",
  };
};

export const parseSelectedDerivAccounts = (query: string) => {
  const params = new URLSearchParams(query);
  const accounts: { accountId: string; token: string; currency: string }[] = [];

  // Allowed currencies (case-sensitive output)
  const allowedCurrencies = supportedDerivAccountsType.map(
    (account) => account.currency,
  );

  for (let i = 1; i <= 50; i++) {
    const accountId = params.get(`acct${i}`);
    const token = params.get(`token${i}`);
    const rawCurrency = params.get(`cur${i}`);

    if (!accountId || !token || !rawCurrency) continue;

    // Normalize: split, trim, uppercase for matching, but keep original casing from allowedCurrencies
    const currencies = rawCurrency
      .split(",")
      .map((c) => c.trim())
      .map((c) => {
        const upper = c.toUpperCase();
        return allowedCurrencies.find(
          (allowed) => allowed.toUpperCase() === upper,
        );
      })
      .filter((c): c is string => Boolean(c));

    // Validate accountId: must be CR + digits
    if (!/^CR\d+$/i.test(accountId)) continue;

    for (const currency of currencies) {
      accounts.push({
        accountId,
        token,
        currency, // ensures exact "USD", "USDC", or "tUSDT"
      });
    }
  }

  return accounts;
};
