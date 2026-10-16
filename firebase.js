import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const e = import.meta.env;
// .env values win; the fallbacks are your project's public web config (safe to ship, access is controlled by Firestore rules).
const app = initializeApp({
  apiKey: e.VITE_FIREBASE_API_KEY || 'AIzaSyDAFZjQM-_ET-uFExyv9Zu6XEPzxOCr2cQ',
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN || 'haseeburrehman-324fe.firebaseapp.com',
  projectId: e.VITE_FIREBASE_PROJECT_ID || 'haseeburrehman-324fe',
  storageBucket: e.VITE_FIREBASE_STORAGE_BUCKET || 'haseeburrehman-324fe.firebasestorage.app',
  messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID || '973330670613',
  appId: e.VITE_FIREBASE_APP_ID || '1:973330670613:web:55130e974c9ab3d3409a1c',
});
export const db = getFirestore(app);
export const auth = getAuth(app);
