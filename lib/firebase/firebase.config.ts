import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

let serviceAccount: ServiceAccount;

if (process.env.NODE_ENV === "development") {
  serviceAccount = require("../../serviceAccountKey.json") as ServiceAccount;
} else {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "pavied-telegram.firebasestorage.app",
  });
}

const firestoreDb = getFirestore();
const bucket = getStorage().bucket();

export { firestoreDb, bucket, getDownloadURL };
