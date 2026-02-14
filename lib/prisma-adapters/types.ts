import type { Transaction } from "@/prisma/lib/generated/prisma/browser";
import type { TransactionGetPayload } from "@/prisma/lib/generated/prisma/models";
import type { DecimalToNumber } from "./utils";

export type TransactionWithData = DecimalToNumber<
  TransactionGetPayload<{
    include: {
      derivDepositExtra: true;
      derivWithdrawalExtra: true;
    };
  }>
>;

export type BaseTransaction = DecimalToNumber<Transaction>;
