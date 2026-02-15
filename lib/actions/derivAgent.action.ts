"use server";

import "server-only";

import type { DerivAccount } from "@/prisma/lib/generated/prisma/client";
import handleError from "../handlers/error";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";

export const fetchAgentAccount = async (
  currency: string,
): Promise<ActionResponse<DerivAccount>> => {
  try {
    const agentAccount = await prismaAdapter.deriv.getAgentAccount(currency);

    if (!agentAccount) throw new Error("Agent account not found");

    return { success: true, data: agentAccount };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
