import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

function getFirebaseApp(): FirebaseApp {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Firebase não configurado. Defina as variáveis VITE_FIREBASE_* no ambiente.");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp: FirebaseApp = getFirebaseApp();
export const db: Firestore = getFirestore(firebaseApp);


