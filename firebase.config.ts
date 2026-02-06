import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "pavied-telegram.firebasestorage.app",
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket, getDownloadURL };
