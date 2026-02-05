import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import logger from "@/lib/logger";

//  Verify that this messages comes from QStash
export const POST = verifySignatureAppRouter(async (req: Request) => {
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

  return NextResponse.json({ sucess: true }, { status: 201 });
});
