import { db } from "@/firebase.config";
import handleError from "../handlers/error";
import { dateConverter } from "../utils/firebase";

export const fetchRates = async (): Promise<
  ActionResponse<CurrencyConfig[]>
> => {
  try {
    const snap = await db
      .collection("rates")
      .withConverter(dateConverter)
      .get();
    const rates = snap.docs.map((doc) => doc.data() as CurrencyConfig);

    return { success: true, data: rates };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const fetchRate = async (
  currency: string,
): Promise<ActionResponse<CurrencyConfig>> => {
  try {
    const snap = await db
      .collection("rates")
      .where("code", "==", currency)
      .withConverter(dateConverter)
      .get();

    if (snap.empty) throw new Error("Currency config not found");

    const currencyConfig = snap.docs[0].data() as CurrencyConfig;

    return { success: true, data: currencyConfig };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
