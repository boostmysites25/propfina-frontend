import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0MheWwPrtinGAkQpaDqKcUBh0FEY-9rs",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "propinfinia-b1452.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "propinfinia-b1452",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "propinfinia-b1452.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "32116602272",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:32116602272:web:07e1d4dba017f219ef20c5",
};

console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
});

// Initialize Firebase app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
export default app; 