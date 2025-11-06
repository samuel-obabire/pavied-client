/* eslint-disable camelcase */
import "server-only";

import { DerivAPIClient } from "@deriv-com/api-client";
import type { PaymentAgentWithdrawParams } from "../actions/types/action";
import { getDerivAccounts } from "../firebase/deriv";
import { isDerivError } from "../utils/deriv";
import handleError from "./error";

const APP_ID = process.env.DERIV_APP_ID;

const createDerivApiConnection = () => {
  if (!APP_ID) throw new Error("APP_ID is missing");

  return new DerivAPIClient(
    `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`,
  );
};

export const paymentAgentWithdraw = async (
  data: PaymentAgentWithdrawParams,
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

export const verifyWithdrawEmail = async (data: {
  userToken: string;
  accountId: string;
}) => {
  const derivAPI = createDerivApiConnection();

  try {
    const authorizeResponse = await derivAPI.send({
      name: "authorize",
      payload: { authorize: data.userToken },
    });

    if (authorizeResponse.authorize?.email) {
      const res = await derivAPI.send({
        // @ts-expect-error: Line of code is correct
        name: "verify_email",
        payload: {
          verify_email: authorizeResponse.authorize.email,
          type: "paymentagent_withdraw",
        },
      });

      // @ts-expect-error
      if (res.verify_email === 1)
        return {
          email: authorizeResponse.authorize?.email,
          isEmailSent: true,
        };
    }

    return { email: authorizeResponse.authorize?.email, isEmailSent: false };
  } catch (error) {
    derivAPI.disconnect();

    if (isDerivError(error)) {
      throw new Error(`${error.code}: ${error.message}`);
    }
  } finally {
    derivAPI.disconnect();
  }
};

export const getUserDerivAccountWithTokens = async (
  userId: string,
): Promise<ActionResponse<DerivAccount[]>> => {
  try {
    const derivAccounts = await getDerivAccounts(userId, {
      onlyActive: true,
      withToken: true,
    });

    return { success: true, data: derivAccounts };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getDerivAccountToken = async (
  userId: string,
  derivLoginId: string,
) => {
  const res = await getUserDerivAccountWithTokens(userId);
  if (!res.success) return null;

  const account = res.data!.find((acc) => acc.accountId === derivLoginId);
  if (!account || !account.token) return null;

  return account.token;
};
