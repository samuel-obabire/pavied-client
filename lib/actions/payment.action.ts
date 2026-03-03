"use server";

import "server-only";

import { after } from "next/server";
import { api } from "../api";
import { ROUTES } from "../constants/routes";
import { bucket } from "../firebase/firebase.config";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import logger from "../logger";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import type {
  BaseTransaction,
  TransactionWithData,
} from "../prisma-adapters/types";
import { verifySession } from "../server";
import { notifyAdmin } from "../telegram/notification";
import { publishToQStash } from "../utils/qstash";
import { UploadPaymentRecieptSchema } from "../validation";
import type { TransactionQueryParams } from "./types/action";

export const getPaymentTransaction = async (
  paymentId: string,
): Promise<ActionResponse<TransactionWithData>> => {
  const session = await verifySession();
  const user = session?.user;

  try {
    if (!paymentId || !user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction =
      await prismaAdapter.transactions.getTransactionById(paymentId);

    if (!transaction) throw new NotFoundError("Transaction");

    return { success: true, data: transaction };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTransactions = async (
  userId: string,
  query: TransactionQueryParams = {},
): Promise<ActionResponse<BaseTransaction[]>> => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id || user?.id !== userId) {
    return handleError(
      new UnauthorizedError("Not authorized"),
    ) as ErrorResponse;
  }

  try {
    const transactions = await prismaAdapter.transactions.getUserTransactions(
      userId,
      query,
    );

    return { success: true, data: transactions };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

const updateDerivDepositTransactionRecieptPath = async (
  paymentId: string,
  recieptPath: string,
): Promise<ActionResponse> => {
  try {
    if (!paymentId || !recieptPath || typeof recieptPath !== "string") {
      throw new Error("Reciept path and payment id is required");
    }

    await prismaAdapter.runDbTransaction(async (tx) => {
      const transaction = await tx.getTransaction(paymentId);
      if (!transaction) throw new NotFoundError("Transaction");

      await tx.updateDerivDepositTransactionRecieptPath(paymentId, recieptPath);
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const uploadPaymentReciept = async (
  formData: FormData,
): Promise<ActionResponse> => {
  const session = await verifySession();
  const user = session?.user;

  try {
    if (!user?.id) throw new UnauthorizedError();

    const result = UploadPaymentRecieptSchema.parse({
      file: formData.get("file"),
      paymentId: formData.get("paymentId"),
    }) as { file: File; paymentId: string };

    const { file, paymentId } = result;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${paymentId}-${file.name}`;
    const destination = `uploads/${fileName}`;

    const fileRef = bucket.file(destination);

    await fileRef.save(buffer, {
      contentType: file.type,
    });

    await updateDerivDepositTransactionRecieptPath(paymentId, fileName);

    after(async () => {
      await notifyAdmin(`${user.id} have marked an order as paid`).catch(
        logger.error,
      );
    });

    after(async () => {
      logger.info(
        `Triggering deriv deposit completion for payment: ${paymentId}`,
      );

      const result = await api.deriv.triggerCompleteDerivDeposit(paymentId);

      if (!result.success) {
        // retry confirmation using qStash
        await publishToQStash({
          url: `${process.env.NEXT_PUBLIC_URL}${ROUTES.VERIFY_DERIV_DEPOSIT}`,
          delay: 15, // 15 seconds
          body: {
            transactionId: paymentId,
          },
        });

        return;
      }

      logger.info(
        `Deposit completion for payment: ${paymentId}. success: ${result.success}, ${result.data?.clientAccount}`,
      );
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
