import {
  DocumentData,
  PartialWithFieldValue,
  WriteResult,
} from "firebase-admin/firestore";

import { db } from "../firebase.config";

export const runtime = "nodejs";

interface AddDataOptions {
  merge?: boolean;
}

interface AddDataParams<T> {
  path: string;
  docId?: string;
  data: T;
  options?: AddDataOptions;
}

interface AddDataResult {
  id: string;
  writeResult: WriteResult;
}

/**
 * Adds or updates a Firestore document.
 * - If `docId` is provided, updates that document.
 * - If `docId` is omitted, creates a new document with a generated ID.
 * @returns The document ID and the Firestore write result.
 */
export const addData = async <T>({
  path,
  docId,
  data,
  options = {},
}: AddDataParams<T>): Promise<AddDataResult> => {
  const collectionRef = db.collection(path);

  const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc();

  const writeResult = await docRef.set(
    data as PartialWithFieldValue<DocumentData>,
    options
  );

  return {
    id: docRef.id,
    writeResult,
  };
};
