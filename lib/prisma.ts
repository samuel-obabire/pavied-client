import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/prisma/lib/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  (() => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
