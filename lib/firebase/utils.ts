import { Timestamp } from "firebase-admin/firestore";

export const dateConverter = {
  toFirestore: (data: any) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data();

    const convert = (obj: any): any => {
      if (obj instanceof Timestamp) return obj.toDate();
      if (Array.isArray(obj)) return obj.map(convert);
      if (obj && typeof obj === "object") {
        const result: Record<string, any> = {};
        for (const key in obj) result[key] = convert(obj[key]);
        return result;
      }
      return obj;
    };

    return convert(data);
  },
};
