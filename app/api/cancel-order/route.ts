import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { getPaymentTransaction } from "@/lib/actions/payment.action";
import { api } from "@/lib/api";
import { NotFoundError } from "@/lib/http-errors";
import logger from "@/lib/logger";

//  Verify that this messages comes from QStash
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();

  const { transactionId, reason } = body as {
    transactionId: string;
    reason?: string;
  };

  try {
    const { data: transaction } = await getPaymentTransaction(transactionId);

    if (!transaction) throw new NotFoundError(`Transaction ${transactionId}`);

    if (transaction && transaction.status !== "pending")
      return NextResponse.json({ sucess: true }, { status: 201 });

    // proceed to cancel
    await api.deriv.declineDerivDeposit(
      transactionId,
      "",
      reason ?? "Transaction cancelled",
    );
  } catch (error) {
    logger.error(error);

    return NextResponse.json({ sucess: true }, { status: 201 });
  }

  return NextResponse.json({ sucess: true }, { status: 201 });
});
