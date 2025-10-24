/* eslint-disable camelcase */
import "server-only";

import { DerivAPIClient } from "@deriv-com/api-client";

import { PaymentAgentWithdrawParams } from "../actions/types/action";
import { isDerivError } from "../utils/deriv";
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
