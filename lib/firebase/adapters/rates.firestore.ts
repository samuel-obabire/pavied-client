import { db } from "@/firebase.config";
import { DbCollections } from "@/lib/constants/dbCollections";
import { dateConverter } from "../utils";

export const ratesFirestore = {
  getRates: async () => {
    const snap = await db
      .collection(DbCollections.RATES)
      .withConverter(dateConverter)
      .get();

    return snap.docs.map((d) => d.data() as CurrencyConfig);
  },

  getRateByCurrency: async (currency: string) => {
    const snap = await db
      .collection(DbCollections.RATES)
      .where("code", "==", currency)
      .withConverter(dateConverter)
      .get();

    return snap.empty ? null : (snap.docs[0].data() as CurrencyConfig);
  },
};
