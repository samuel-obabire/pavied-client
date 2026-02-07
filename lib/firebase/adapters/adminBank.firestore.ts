import { DbCollections } from "@/lib/constants/dbCollections";
import { db } from "../firebase.config";
import { deleteById, queryWhere, setById, updateByid } from "../firestore";

export const adminBankFirestore = {
  addAdminBankAccount: async (
    bankAccount: Omit<AdminBankAccount, "createdAt" | "updatedAt">,
  ) => {
    return await setById(
      DbCollections.ADMIN_BANK_ACCOUNTS,
      bankAccount.id,
      bankAccount,
    );
  },
  getAdminActiveBankAccounts: async () => {
    return await queryWhere<AdminBankAccount>(
      DbCollections.ADMIN_BANK_ACCOUNTS,
      "isActive",
      "==",
      true,
    );
  },
  updateAdminBankAccount: async (
    bankAccountId: string,
    data: Partial<AdminBankAccount>,
  ) => {
    return await updateByid(
      DbCollections.ADMIN_BANK_ACCOUNTS,
      bankAccountId,
      data,
    );
  },
  getAdminDefaultBankAccount: async () => {
    const existing = await queryWhere<AdminBankAccount | null>(
      DbCollections.ADMIN_BANK_ACCOUNTS,
      "default",
      "==",
      true,
    );
    return existing[0] ?? null;
  },

  setAdminDefaultBankAccount: async (
    bankAccountId: string,
    previousDefaultBankAccountId?: string,
  ) => {
    if (bankAccountId === previousDefaultBankAccountId) return;

    const batch = db.batch();

    const newBankRef = db
      .collection(DbCollections.ADMIN_BANK_ACCOUNTS)
      .doc(bankAccountId);

    batch.update(newBankRef, { default: true });

    if (previousDefaultBankAccountId) {
      const previousBankRef = db
        .collection(DbCollections.ADMIN_BANK_ACCOUNTS)
        .doc(previousDefaultBankAccountId);

      batch.update(previousBankRef, { default: false });
    }

    await batch.commit();
  },

  deactivateAdminBankAccount: async (bankAccountId: string) => {
    return updateByid(DbCollections.ADMIN_BANK_ACCOUNTS, bankAccountId, {
      isActive: false,
    });
  },
  activateAdminBankAccount: async (bankAccountId: string) => {
    return updateByid(DbCollections.ADMIN_BANK_ACCOUNTS, bankAccountId, {
      isActive: true,
    });
  },
  deleteAdminBankAccount: async (bankAccountId: string) => {
    return deleteById(DbCollections.ADMIN_BANK_ACCOUNTS, bankAccountId);
  },
};
