import { db } from "@/firebase.config";

import handleError from "../handlers/error";
import { dateConverter } from "../utils/firebase";

export const fetchRates = async (

): Promise<ActionResponse<CurrencyConfig[]>> => {
  try {
   const snap = await db.collection("rates").withConverter(dateConverter).get()
   const rates = snap.docs.map(doc => doc.data() as CurrencyConfig)

    return { success: true, data: rates };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
