"use server";

import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { bucket, db } from "@/firebase.config";

import { getTransactionById } from "../firebase/transactions";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { verifySession } from "../server";
import { UploadPaymentRecieptSchema } from "../validation";
import {
  TransactionQueryParams,
  UpdatePaymentTransactionParams,
} from "./types/action";
import { ROUTES } from "../constants/routes";
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

export const updatePaymentTransaction = async (
  paymentId: string,
  data: UpdatePaymentTransactionParams
): Promise<ActionResponse> => {
  const fieldMap: Record<keyof UpdatePaymentTransactionParams, string> = {
    status: "status",
    fulfilled: "fulfillment.fulfilled",
    fulfilledAt: "fulfillment.fulfilledAt",
    actorId: "fulfillment.actorId",
    referenceId: "fulfillment.referenceId",
    recieptPath: "extra.recieptPath",
    note: "fulfillment.note",
  };

  const updatedData = Object.entries(data).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (value === undefined) return acc;
      const mappedField = fieldMap[key as keyof UpdatePaymentTransactionParams];
      if (mappedField) acc[mappedField] = value;
      return acc;
    },
    {}
  );

  try {
    const transactionRef = db.collection("transactions").doc(paymentId);

    await db.runTransaction(async (t) => {
      const snapshot = await t.get(transactionRef);
      if (!snapshot.exists) throw new NotFoundError("Transaction");

      t.update(transactionRef, {
        ...updatedData,
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

    // retrieve temporary url
    // const [url] = await fileRef.getSignedUrl({
    //   action: "read",
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
    // });

    await fileRef.save(buffer, {
      contentType: file.type,
    });

    await updatePaymentTransaction(paymentId, {
      recieptPath: fileName,
      status: "processing",
      // fulfilled: true,
      // fulfilledAt: new Date(),
      // actorId: "admin_123",
      // referenceId: "txn_ref_789",
      // note: "Transaction verified and completed successfully.",
    });

    revalidatePath(ROUTES.PAYMENT(paymentId));

    // return { success: true, filePath: destination, signedUrl: url };
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
