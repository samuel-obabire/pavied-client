import {
  initializeApp,
  cert,
  ServiceAccount,
  getApps,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccountJson from "./serviceAccountKey.json";
const serviceAccount = serviceAccountJson as ServiceAccount;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

export const db = getFirestore();
