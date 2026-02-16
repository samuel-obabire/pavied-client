import { Prisma } from "@/prisma/lib/generated/prisma/client";

export type DecimalToNumber<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? T
    : T extends Array<infer U>
      ? DecimalToNumber<U>[]
      : T extends object
        ? { [K in keyof T]: DecimalToNumber<T[K]> }
        : T;

export function transformDecimals<T>(obj: T): DecimalToNumber<T> {
  if (obj instanceof Prisma.Decimal) {
    return obj.toNumber() as DecimalToNumber<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformDecimals) as DecimalToNumber<T>;
  }

  if (obj && typeof obj === "object" && !(obj instanceof Date)) {
    const result = {} as { [K in keyof T]: DecimalToNumber<T[K]> };

    for (const key in obj) {
      result[key] = transformDecimals(obj[key]);
    }

    return result as DecimalToNumber<T>;
  }

  return obj as DecimalToNumber<T>;
}
