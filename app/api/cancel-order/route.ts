import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import logger from "@/lib/logger";

//  Verify that this messages comes from QStash
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  const { transactionId } = body as { transactionId: string };

  try {
    await api.deriv.declineDerivDeposit(
      transactionId,
      "",
      "Transaction cancelled as payment was not completed before timer elapsed",
    );
  } catch (error) {
    logger.error(error);
  }

  return NextResponse.json({ sucess: true }, { status: 201 });
});
