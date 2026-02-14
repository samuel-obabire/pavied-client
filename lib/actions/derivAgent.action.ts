"use server";

import "server-only";

import type { DerivAccount } from "@/prisma/lib/generated/prisma/client";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import handleError from "../handlers/error";

export const fetchAgentAccount = async (
  currency: string,
): Promise<ActionResponse<DerivAccount>> => {
  try {
    const agentAccount = await firestoreAdapter.deriv.getAgentAccount(currency);

    if (!agentAccount) throw new Error("Agent account not found");

    return { success: true, data: agentAccount };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
