import { Timestamp, WhereFilterOp } from "firebase-admin/firestore";

import { db } from "@/firebase.config";

export const getById = async <T>(
  col: string,
  docId: string
): Promise<T | null> => {
  const snap = await db.collection(col).doc(docId).get();
  return snap.exists
    ? {
        ...(snap.data() as T),
        createdAt: (snap?.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (snap?.data()?.createdAt as Timestamp)?.toDate(),
      }
    : null;
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

export const queryWhere = async <T, B extends WhereFilterOp>(
  col: string,
  field: string,
  op: B,
  value: string | number
): Promise<T[]> => {
  const snap = await db.collection(col).where(field, op, value).get();

  if (snap.empty) return [];
  return snap.docs.map((value) => {
    const data = value.data();

    // Convert Firestore Timestamps to JS Date
    for (const [key, val] of Object.entries(data)) {
      if (val instanceof Timestamp) {
        data[key] = val.toDate();
      }
    }

    return data as T;
  });
};
