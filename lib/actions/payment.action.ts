"use server";

import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { after } from "next/server";

import { bucket, db } from "@/firebase.config";

import { api } from "../api";
import { getTransactionById } from "../firebase/transactions";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import { UploadPaymentRecieptSchema } from "../validation";
import {
  TransactionQueryParams,
} from "./types/action";
import { dateConverter } from "../utils/firebase";

export const getPaymentTransaction = async (
  paymentId: string
): Promise<ActionResponse<Transaction>> => {
  const user = await verifySession();

  try {
    if (!paymentId || !user?.id) {
      throw new UnauthorizedError("Not Authorized");
    }

    const transaction = await getTransactionById(paymentId);

    if (!transaction) throw new NotFoundError("Transaction");

    return { success: true, data: transaction };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTransactions = async (
  userId: string,
  query: TransactionQueryParams = {}
): Promise<ActionResponse<Transaction[]>> => {
  const user = await verifySession();

  if (!user?.id || user?.id !== userId) {
    return handleError(
      new UnauthorizedError("Not authorized")
    ) as ErrorResponse;
  }

  try {
    const { page = 1, perPage = 10, endDate, startDate, status, type } = query;

    let tRef = db
      .collection("transactions")
      .limit(perPage)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .withConverter(dateConverter);

    if (page > 1) {
      tRef = tRef.offset((page - 1) * perPage);
    }

    if (startDate) {
      tRef = tRef.where("createdAt", ">=", new Date(startDate));
    }

    if (endDate) {
      tRef = tRef.where("createdAt", "<=", new Date(endDate));
    }

    if (status) {
      tRef = tRef.where("status", "==", status);
    }

    if (type) {
      tRef = tRef.where("type", "==", type);
    }

    const snap = await tRef.get();

    const transactions = snap.docs.map((doc) => doc.data() as Transaction);

    return { success: true, data: transactions };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

 const updateTransactionRecieptPath = async (
  paymentId: string,
  recieptPath: string
): Promise<ActionResponse> => {
  try {
    if (!paymentId || !recieptPath || typeof recieptPath !== "string") {
      throw new Error("Reciept path and payment id is required")
    }

    const transactionRef = db.collection("transactions").doc(paymentId);

    await db.runTransaction(async (t) => {
      const snapshot = await t.get(transactionRef);
      if (!snapshot.exists) throw new NotFoundError("Transaction");

      t.update(transactionRef, {
       "extra.recieptPath": recieptPath,
        updatedAt: Timestamp.now(),
      });
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const uploadPaymentReciept = async (
  formData: FormData
): Promise<ActionResponse> => {
  const user = await verifySession();

  let transactionId: string | null = null

  after(async () => {
   if (user?.id && transactionId) {
   await api.deriv.triggerCompleteDerivDeposit(transactionId)
   }
  })

  try {
    if (!user?.id) throw new UnauthorizedError();

    const result = UploadPaymentRecieptSchema.parse({
      file: formData.get("file"),
      paymentId: formData.get("paymentId"),
    }) as { file: File; paymentId: string };

    const { file, paymentId } = result;

    transactionId = paymentId

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${paymentId}-${file.name}`;
    const destination = `uploads/${fileName}`;

    const fileRef = bucket.file(destination);

    // retrieve temporary url
    // const [url] = await fileRef.getSignedUrl({
    //   action: "read",
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
    // });

    await fileRef.save(buffer, {
      contentType: file.type,
    });

    await updateTransactionRecieptPath(paymentId, fileName);

    // return { success: true, filePath: destination, signedUrl: url };
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
