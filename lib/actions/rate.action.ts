import { unstable_cache as nextCache } from "next/cache";
import type { CurrencyRate } from "@/prisma/lib/generated/prisma/client";
import handleError from "../handlers/error";
import { prismaAdapter } from "../prisma-adapters/prisma.adapter";
import {
  type DecimalToNumber,
  transformDecimals,
} from "../prisma-adapters/utils";

export const fetchCachedRates = nextCache(
  async (): Promise<ActionResponse<DecimalToNumber<CurrencyRate[]>>> => {
    try {
      const currencyRates = await prismaAdapter.rates.getRates();

      return { success: true, data: transformDecimals(currencyRates) };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
  ["all-rates-key"],
  { tags: ["rates-tag"] },
);

export const fetchCachedRate = (currency: string) =>
  nextCache(
    async (): Promise<ActionResponse<DecimalToNumber<CurrencyRate>>> => {
      try {
        const currencyRate =
          await prismaAdapter.rates.getRateByCurrency(currency);

        if (!currencyRate) throw new Error("Currency config not found");

        return { success: true, data: transformDecimals(currencyRate) };
      } catch (error) {
        return handleError(error) as ErrorResponse;
      }
    },
    ["single-rate-key", currency],
    { tags: ["rates-tag"] },
  );
