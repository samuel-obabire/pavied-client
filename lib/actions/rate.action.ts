import { unstable_cache as nextCache } from "next/cache";
import { firestoreAdapter } from "../firebase/firestore.adapter";
import handleError from "../handlers/error";

export const fetchCachedRates = nextCache(async (): Promise<
  ActionResponse<CurrencyConfig[]>
> => {
  try {
    const currencyConfigs = await firestoreAdapter.rates.getRates();

    return { success: true, data: currencyConfigs };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}, ["rates"]);

export const fetchCachedRate = nextCache(
  async (currency: string): Promise<ActionResponse<CurrencyConfig>> => {
    try {
      const currencyConfig =
        await firestoreAdapter.rates.getRateByCurrency(currency);

      if (!currencyConfig) throw new Error("Currency config not found");

      return { success: true, data: currencyConfig };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
  ["rate"],
);
