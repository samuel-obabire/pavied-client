"use server";

import "server-only";

import { getAgentAccount } from "../firebase/deriv";
import handleError from "../handlers/error";

export const fetchAgentAccount = async (
  currency: string,
): Promise<ActionResponse<DerivAccount>> => {
  try {
    const agentAccount = await getAgentAccount(currency);

    if (!agentAccount) throw new Error("Agent account not found");

    return { success: true, data: agentAccount };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
