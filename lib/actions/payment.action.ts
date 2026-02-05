"use server";

import "server-only";

import { after } from "next/server";
import { api } from "../api";
import { ROUTES } from "../constants/routes";
import { ENV } from "../env";
import { bucket } from "../firebase/firebase.config";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import logger from "../logger";
import { verifySession } from "../server";
import { publishToQStash } from "../utils";
import { UploadPaymentRecieptSchema } from "../validation";
import type { TransactionQueryParams } from "./types/action";

export const getPaymentTransaction = async (
  paymentId: string,
): Promise<ActionResponse<Transaction>> => {
  const user = await verifySession();

  try {
    if (!paymentId || !user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction =
      await firestoreAdapter.transactions.getTransactionById(paymentId);

    if (!transaction) throw new NotFoundError("Transaction");

    return { success: true, data: transaction };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTransactions = async (
  userId: string,
  query: TransactionQueryParams = {},
): Promise<ActionResponse<Transaction[]>> => {
  const user = await verifySession();

  if (!user?.id || user?.id !== userId) {
    return handleError(
      new UnauthorizedError("Not authorized"),
    ) as ErrorResponse;
  }

  try {
    const transactions =
      await firestoreAdapter.transactions.getUserTransactions(userId, query);

    return { success: true, data: transactions };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

const updateTransactionRecieptPath = async (
  paymentId: string,
  recieptPath: string,
): Promise<ActionResponse> => {
  try {
    if (!paymentId || !recieptPath || typeof recieptPath !== "string") {
      throw new Error("Reciept path and payment id is required");
    }

    await firestoreAdapter.runTransaction(async (tx) => {
      const transaction = await tx.getTransaction(paymentId);
      if (!transaction) throw new NotFoundError("Transaction");

      await tx.updateTransaction(paymentId, {
        "extra.recieptPath": recieptPath,
      });
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const uploadPaymentReciept = async (
  formData: FormData,
): Promise<ActionResponse> => {
  const user = await verifySession();

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

    await updateTransactionRecieptPath(paymentId, fileName);

    after(async () => {
      logger.info(
        `Triggering deriv deposit completion for payment: ${paymentId}`,
      );

      const result = await api.deriv.triggerCompleteDerivDeposit(paymentId);

      if (!result.success) {
        // retry confirmation using qStash
        await publishToQStash({
          url: `${ENV.NEXT_PUBLIC_URL}/${ROUTES.VERIFY_DERIV_DEPOSIT}`,
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
