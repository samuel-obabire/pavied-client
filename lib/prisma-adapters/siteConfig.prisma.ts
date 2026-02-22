import prisma from "@/lib/prisma";

export const siteConfigAdapter = {
  getSiteConfig: async (docId = "default") => {
    const config = await prisma.siteConfig.findUnique({
      where: { id: docId },
    });

    return config;
  },
};
