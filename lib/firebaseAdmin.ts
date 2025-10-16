// lib/firebaseAdmin.ts
import admin from "firebase-admin";
import serviceAccountJson from "../serviceAccountKey.json";
import { ServiceAccount } from "firebase-admin";

const serviceAccount = serviceAccountJson as ServiceAccount;

// Initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Firestore instance
const db = admin.firestore();

export { db, admin };
