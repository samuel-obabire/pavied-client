import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { ENV } from "@/lib/env";
import { firestoreAdapter } from "@/lib/firebase/firestore.adapter";
import { NotFoundError } from "@/lib/http-errors";
import logger from "@/lib/logger";
import { publishToQStash } from "@/lib/utils";
import { redis } from "@/lib/utils/redis";

const KEY_NAME = "pavied:verify";

//  Verify that this messages comes from QStash
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();

  const { transactionId } = body as {
    transactionId: string;
  };

  try {
    const transaction =
      await firestoreAdapter.transactions.getTransactionById(transactionId);

    if (!transaction) throw new NotFoundError(`Transaction ${transactionId}`);

    if (transaction && transaction.status === "pending") {
      const result = await api.deriv.triggerCompleteDerivDeposit(
        transaction?.transactionId,
      );

      if (!result.success) {
        const keyName = `${KEY_NAME}:${transactionId}`;

        // proceed to schedule another confirmation
        const attempts = await redis.incr(keyName);

        if (attempts === 1) await redis.expire(keyName, 900); // expire after 15 mins

        const delays = [60, 120, 240, 480, 720];
        if (attempts <= delays.length) {
          logger.info(
            `Resheduling  reconfirmation attempt ${attempts} for transaction: ${transactionId}`,
          );

          await publishToQStash({
            // recall the same route
            url: `${ENV.NEXT_PUBLIC_URL}/${ROUTES.VERIFY_DERIV_DEPOSIT}`,
            delay: delays[attempts - 1],
            body: {
              transactionId,
            },
          });
        }
      }
    }
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ success: true }, { status: 201 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
});
