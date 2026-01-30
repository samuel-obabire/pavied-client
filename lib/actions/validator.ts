import type { SupportedCurrencies } from "@deriv/api-types";
import { firestoreAdapter } from "../firebase/firestore.adapter";

export const supportedCurrencies: SupportedCurrencies = [
  "USD",
  "USDC",
  "eUSDT",
  "tUSDT",
];

const assertSiteIsActive = (siteConfig: SiteConfig) => {
  if (siteConfig.maintenanceMode) {
    throw new Error("Site is under maintenance");
  }
};

const assertPaymentsNotPaused = (siteConfig: SiteConfig) => {
  if (siteConfig.paymentsPaused) {
    throw new Error("Payments are currently paused");
  }
};

const assertDerivPaymentEnabled = (siteConfig: SiteConfig) => {
  if (!siteConfig.deriv.deposits.enabled) {
    throw new Error("Deriv deposits are currently disabled");
  }
};

const assertUserAccountIsActive = async (userId: string) => {
  const user = await firestoreAdapter.user.getUserById(userId);

  if (user?.disabled) {
    throw new Error("User account is disabled");
  }
};

const assertUserCanFundTheAccount = (
  userDerivAccounts: DerivAccount[],
  currencyToFund: string,
) => {
  const acc = userDerivAccounts.find((acc) => acc.currency === currencyToFund);

  if (!acc || !acc.active)
    throw new Error("You cannot fund this account as the account is disabled");
};

const assertCurrencyisAvailable = (
  currencyConfig: CurrencyConfig,
  currencytoFund: string,
) => {
  console.log(currencyConfig, currencytoFund);
  if (!currencyConfig || !currencyConfig.active)
    throw new Error(
      `Deriv deposit  is currently not available for ${currencytoFund}`,
    );
};

const assertRateIsTheSame = (currentRate: number, usedRate: number) => {
  if (usedRate !== currentRate)
    throw new Error("Rate changed. Please refresh and try again.");
};

const assertDepositAmountWithinSiteLimits = (
  amount: number,
  siteConfig: SiteConfig,
) => {
  if (amount > siteConfig.deriv.deposits.maxAmount) {
    throw new Error("Transaction is greater than the max deposit amount");
  }
};

const assertDepositAmountWithinCurrencyDepositLimits = (
  currencyDepositMin: number,
  currencyDepositMax: number,
  amountToFund: number,
) => {
  if (amountToFund < currencyDepositMin || amountToFund > currencyDepositMax) {
    throw new Error(
      `Minimum deposit: ${currencyDepositMin}, Maximum ${currencyDepositMax}`,
    );
  }
};

export {
  assertCurrencyisAvailable,
  assertDerivPaymentEnabled,
  assertUserAccountIsActive,
  assertSiteIsActive,
  assertPaymentsNotPaused,
  assertUserCanFundTheAccount,
  assertDepositAmountWithinSiteLimits,
  assertRateIsTheSame,
  assertDepositAmountWithinCurrencyDepositLimits,
};
