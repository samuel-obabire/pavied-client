import { db } from "@/firebase.config";
import { DbCollections } from "@/lib/constants/dbCollections";
import { deleteById } from "../firestore";
import { dateConverter } from "../utils";

const bankDocId = (bankCode: string, accountNumber: string) =>
  `${bankCode}_${accountNumber}`;

export const bankFirestore = {
  removeBankAccount: async ({ bankCode, accountNumber }: BankAccount) =>
    deleteById(DbCollections.BANK_ACCOUNTS, bankDocId(bankCode, accountNumber)),

  getBankAccounts: async (userId: string, onlyActive = false) => {
    let q = db
      .collection(DbCollections.BANK_ACCOUNTS)
      .where("userId", "==", userId)
      .withConverter(dateConverter);

    if (onlyActive) q = q.where("active", "==", true);

    const snap = await q.get();
    return snap.docs.map((d) => d.data() as BankAccount);
  },
};
