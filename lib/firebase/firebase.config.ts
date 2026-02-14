import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string,
);

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket,
  });
}

const bucket = getStorage().bucket();

export { bucket, getDownloadURL };
