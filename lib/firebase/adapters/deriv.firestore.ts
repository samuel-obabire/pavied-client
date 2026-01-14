import { db } from "@/firebase.config";
import { DbCollections } from "@/lib/constants/dbCollections";
import { deleteById } from "../firestore";
import { dateConverter } from "../utils";

const derivDocId = (currency: string, accountId: string) =>
  `${currency}_${accountId}`;

export const derivFirestore = {
  removeDerivAccount: async ({ currency, accountId }: DerivAccount) =>
    deleteById(DbCollections.DERIV_ACCOUNTS, derivDocId(currency, accountId)),

  getDerivAccounts: async (
    userId: string,
    options: { onlyActive?: boolean; withToken?: boolean } = {},
  ) => {
    const { onlyActive = false, withToken = false } = options;

    let q = db
      .collection(DbCollections.DERIV_ACCOUNTS)
      .where("userId", "==", userId)
      .withConverter(dateConverter);

    if (onlyActive) q = q.where("active", "==", true);

    const snap = await q.get();
    if (snap.empty) return [];

    const accounts = snap.docs.map((d) => d.data() as DerivAccount);

    return withToken ? accounts : accounts.map(({ token, ...rest }) => rest);
  },

  getAgentAccount: async (currency: string) =>
    db
      .collection(DbCollections.AGENT_ACCOUNTS)
      .doc(currency)
      .get()
      .then((s) => (s.exists ? (s.data() as DerivAccount) : null)),
};
