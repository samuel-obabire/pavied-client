import type { SupportedCurrencies } from "@deriv/api-types";
import type {
  CurrencyRate,
  DerivAccount,
  SiteConfig,
} from "@/prisma/lib/generated/prisma/client";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import type { DecimalToNumber } from "../prisma-adapters/utils";

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

const assertDerivDepositEnabled = (siteConfig: SiteConfig) => {
  if (!siteConfig.derivDepositsEnabled) {
    throw new Error("Deriv deposits are currently disabled");
  }
};

const assertUserAccountIsActive = async (userId: string) => {
  const user = await prismaAdapter.user.getUserById(userId);

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
  currencyConfig: DecimalToNumber<CurrencyRate>,
  currencytoFund: string,
) => {
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
  if (siteConfig.derivDepositsMaxAmount < amount) {
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

const assertWithdrawalAmountWithinSiteLimits = (
  amount: number,
  siteConfig: SiteConfig,
) => {
  if (siteConfig.derivWithdrawalsMaxAmount < amount) {
    throw new Error("Transaction is greater than the max deposit amount");
  }
};

const assertWithdrawAmountWithinCurrencyWithdrawLimits = (
  currencyWithdrawalMin: number,
  currencyWithdrawalMax: number,
  amountToFund: number,
) => {
  if (
    amountToFund < currencyWithdrawalMin ||
    amountToFund > currencyWithdrawalMax
  ) {
    throw new Error(
      `Minimum deposit: ${currencyWithdrawalMin}, Maximum ${currencyWithdrawalMax}`,
    );
  }
};

const assertDerivWithdrawalEnabled = (siteConfig: SiteConfig) => {
  if (!siteConfig.derivWithdrawalsEnabled) {
    throw new Error("Deriv withdrawals are currently disabled");
  }
};

const assertUserCanWithdrawFromAccount = (
  userDerivAccounts: DerivAccount[],
  currencyToWithdraw: string,
) => {
  const acc = userDerivAccounts.find(
    (acc) => acc.currency === currencyToWithdraw,
  );

  if (!acc || !acc.active)
    throw new Error(
      "You cannot withdraw from this account as the account is disabled",
    );
};

const assertCurrencyWithdrawIsAvailable = async (
  currencyToWithdraw: string,
) => {
  const agentAccount =
    await prismaAdapter.deriv.getAgentAccount(currencyToWithdraw);

  if (!agentAccount || !agentAccount.active)
    throw new Error(
      `Deriv withdrawal  is currently not available for ${currencyToWithdraw} at the moment please try again later`,
    );
};

export {
  assertCurrencyisAvailable,
  assertDerivDepositEnabled,
  assertUserAccountIsActive,
  assertSiteIsActive,
  assertPaymentsNotPaused,
  assertUserCanFundTheAccount,
  assertDepositAmountWithinSiteLimits,
  assertRateIsTheSame,
  assertDepositAmountWithinCurrencyDepositLimits,
  assertWithdrawalAmountWithinSiteLimits,
  assertWithdrawAmountWithinCurrencyWithdrawLimits,
  assertDerivWithdrawalEnabled,
  assertUserCanWithdrawFromAccount,
  assertCurrencyWithdrawIsAvailable,
};
