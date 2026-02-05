import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import logger from "@/lib/logger";

// Note: QStash signature verification disabled - re-enable when QSTASH_TOKEN is configured
export async function POST(req: Request) {
  const body = await req.json();
  const { transactionId, reason } = body as {
    transactionId: string;
    reason?: string;
  };

  try {
    await api.deriv.declineDerivDeposit(
      transactionId,
      "",
      reason ?? "Transaction cancelled",
    );
  } catch (error) {
    logger.error(error);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
