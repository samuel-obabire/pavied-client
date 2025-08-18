import { WhereFilterOp } from "firebase-admin/firestore";

import { db } from "@/firebase.config";

export const getById = async <T>(
  col: string,
  docId: string
): Promise<T | null> => {
  const snap = await db.collection(col).doc(docId).get();
  return snap.exists ? (snap.data() as T) : null;
};

export const setById = async <T>(col: string, docId: string, data: T) => {
  const docRef = db.collection(col).doc(docId);
  await docRef.set({ ...data, updatedAt: Date.now() });
};

export const updateByid = async <T>(col: string, docId: string, data: T) => {
  await db
    .collection(col)
    .doc(docId)
    .update({ ...data, updateAt: Date.now() });
};

export const deleteById = async (col: string, docId: string) => {
  await db.collection(col).doc(docId).delete();
};

export const queryWhere = async <T, B extends WhereFilterOp, C>(
  col: string,
  field: string,
  op: B,
  value: C
): Promise<T[] | null> => {
  const snap = await db.collection(col).where(field, op, value).get();

  if (snap.empty) return null;
  return snap.docs.map((value) => value.data()) as T[];
};
