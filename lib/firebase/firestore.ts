import { Timestamp, type WhereFilterOp } from "firebase-admin/firestore";
import { db } from "@/firebase.config";
import { dateConverter } from "../utils/firebase";
import { firestoreDb } from "./firebase.config";

export const getById = async <T>(
  col: string,
  docId: string,
): Promise<T | null> => {
  const snap = await db
    .collection(col)
    .doc(docId)
    .withConverter(dateConverter)
    .get();
  return snap.exists ? (snap.data() as T) : null;
};

export const setById = async <T>(col: string, docId: string, data: T) => {
  const docRef = db.collection(col).doc(docId);
  await docRef.set({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateByid = async <T>(col: string, docId: string, data: T) => {
  await db
    .collection(col)
    .doc(docId)
    .update({ ...data, updatedAt: Timestamp.now() });
};

export const deleteById = async (col: string, docId: string) => {
  await db.collection(col).doc(docId).delete();
};

export const queryWhere = async <T, B extends WhereFilterOp = "==">(
  col: string,
  field: string,
  op: B,
  value: string | number | boolean,
): Promise<T[]> => {
  const snap = await db
    .collection(col)
    .where(field, op, value)
    .withConverter(dateConverter)
    .get();

  if (snap.empty) return [];
  return snap.docs.map((doc) => doc.data() as T);
};

export const getAll = async <T>(col: string): Promise<T[]> => {
  const snap = await firestoreDb
    .collection(col)
    .withConverter(dateConverter)
    .get();

  return snap.docs.map((doc) => doc.data());
};
