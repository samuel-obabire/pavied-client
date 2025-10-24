import {
  initializeApp,
  cert,
  ServiceAccount,
  getApps,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage, getDownloadURL } from "firebase-admin/storage";

import serviceAccountJson from "./serviceAccountKey.json";
const serviceAccount = serviceAccountJson as ServiceAccount;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "pavied-telegram.firebasestorage.app",
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket, getDownloadURL };
