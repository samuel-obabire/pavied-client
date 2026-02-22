import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { NotFoundError } from "@/lib/http-errors";
import logger from "@/lib/logger";
import { prismaAdapter } from "@/lib/prisma-adapters/prisma.adapter";
import { TransactionStatus } from "@/prisma/lib/generated/prisma/enums";

//  Verify that this messages comes from QStash
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();

  const { transactionId } = body as {
    transactionId: string;
  };

  try {
    const transaction =
      await prismaAdapter.transactions.getTransactionById(transactionId);

    if (!transaction) throw new NotFoundError(`Transaction ${transactionId}`);

    if (transaction && transaction.status !== TransactionStatus.PROCESSING)
      return NextResponse.json({ success: true }, { status: 201 });

    // approve payout
    await api.deriv.approveDerivWithdraw(transactionId);
  } catch (error) {
    logger.error(error);

    return NextResponse.json({ success: true }, { status: 201 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
});
