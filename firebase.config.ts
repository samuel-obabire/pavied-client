import {
  initializeApp,
  cert,
  ServiceAccount,
  getApps,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage, getDownloadURL } from "firebase-admin/storage";

import serviceAccountJson from "./serviceAccountKey.json";

let serviceAccount: ServiceAccount;

if (process.env.NODE_ENV === "development") {
  serviceAccount = serviceAccountJson as ServiceAccount;
} else {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "pavied-telegram.firebasestorage.app",
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket, getDownloadURL };
