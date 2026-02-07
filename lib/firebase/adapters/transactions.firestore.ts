import type { TransactionQueryParams } from "@/lib/actions/types/action";
import { PER_PAGE } from "@/lib/constants";
import { DbCollections } from "@/lib/constants/dbCollections";
import { db } from "../firebase.config";
import { getById } from "../firestore";
import { dateConverter } from "../utils";

export const transactionsFirestore = {
  getTransactionById: async (transactionId: string) =>
    getById<Transaction>(DbCollections.TRANSACTIONS, transactionId),

  getUserTransactions: async (
    userId: string,
    query: TransactionQueryParams,
  ) => {
    const {
      page = 1,
      perPage = PER_PAGE,
      startDate,
      endDate,
      status,
      type,
    } = query;

    let q = db
      .collection(DbCollections.TRANSACTIONS)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .withConverter(dateConverter);

    if (page > 1) q = q.offset(page * perPage);
    if (startDate) q = q.where("createdAt", ">=", new Date(startDate));
    if (endDate) q = q.where("createdAt", "<=", new Date(endDate));
    if (status) q = q.where("status", "==", status);
    if (type) q = q.where("type", "==", type);

    const snap = await q.get();
    return snap.docs.map((d) => d.data() as Transaction);
  },
};
