import prisma from "@/lib/prisma";

export const ratesAdapter = {
  getRates: async () => {
    const rates = await prisma.currencyRate.findMany();

    return rates;
  },

  getRateByCurrency: async (currency: string) => {
    const rate = await prisma.currencyRate.findUnique({
      where: { code: currency },
    });

    return rate;
  },
};
