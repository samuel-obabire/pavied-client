/* eslint-disable camelcase */

import { DerivAPIClient } from "@deriv-com/api-client";

import { supportedDerivAccountsType } from "@/lib/constants/supportedDerivAccountsType";

import { PaymentAgentWithdrawParams } from "../actions/types/action";

import { isDerivError } from ".";

export const getDerivAccount = (currency: string) => {
  return supportedDerivAccountsType.find(
    (derivAccount) => currency === derivAccount.currency
  )!;
};

export const getDerivTransactionDetails = (transaction: Transaction) => {
  return {
    label:
      transaction.type === "deriv_deposit"
        ? "Deriv deposit"
        : "Deriv withdrawal",
    icon: "/assets/bank-logos/palmpay.jpg",
  };
};

export const parseSelectedDerivAccounts = (query: string) => {
  const params = new URLSearchParams(query);
  const accounts: { accountId: string; token: string; currency: string }[] = [];

  // Allowed currencies (case-sensitive output)
  const allowedCurrencies = supportedDerivAccountsType.map(
    (account) => account.currency
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
          (allowed) => allowed.toUpperCase() === upper
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

const APP_ID = process.env.NEXT_PUBLIC_ADMIN_APP_ID || 107466;

const createDerivApiConnection = () => {
  if (!APP_ID) throw new Error("APP_ID is missing");

  return new DerivAPIClient(
    `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`
  );
};

export const paymentAgentWithdraw = async (
  data: PaymentAgentWithdrawParams
) => {
  const derivAPI = createDerivApiConnection();

  try {
    const authorizeResponse = await derivAPI.send({
      name: "authorize",
      payload: { authorize: data.token },
    });

    if (authorizeResponse.error) {
      throw new Error(authorizeResponse.error.message);
    }

    const { amount, currency, paymentagent_loginid, verification_code } = data;

    const paymentAgentWithdrawResponse = await derivAPI.send({
      name: "paymentagent_withdraw",
      payload: {
        amount,
        currency,
        paymentagent_loginid,
        verification_code,
        description: "Withdrawal test",
      },
    });

    return paymentAgentWithdrawResponse;
  } catch (error) {
    derivAPI.disconnect();

    if (isDerivError(error)) {
      throw new Error(`${error.code}: ${error.message}`);
    }
  } finally {
    derivAPI.disconnect();
  }
};

export const verifyWithdrawEmail = async (
  data: { userToken: string; accountId: string } = {
    userToken: process.env.DERIV_CLIENT_TEST_TOKEN!,
    accountId: "CR9223580",
  }
) => {
  const derivAPI = createDerivApiConnection();

  try {
    const authorizeResponse = await derivAPI.send({
      name: "authorize",
      payload: { authorize: data.userToken },
    });

    if (authorizeResponse.authorize?.email) {
      await derivAPI.send({
        // @ts-expect-error: Line of code is correct
        name: "verify_email",
        payload: {
          verify_email: authorizeResponse.authorize.email, // "sampayderi@gmail.com",
          type: "paymentagent_withdraw",
        },
      });
    }
  } catch (error) {
    derivAPI.disconnect();

    if (isDerivError(error)) {
      throw new Error(`${error.code}: ${error.message}`);
    }
  } finally {
    derivAPI.disconnect();
  }
};
