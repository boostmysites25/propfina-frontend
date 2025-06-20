import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Read config from environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0MheWwPrtinGAkQpaDqKcUBh0FEY-9rs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "propinfinia-b1452.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "propinfinia-b1452",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "propinfinia-b1452.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "32116602272",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:32116602272:web:07e1d4dba017f219ef20c5",
};

// Singleton init with error handling
let app;
try {
  // Check if Firebase is already initialized
  app = initializeApp(firebaseConfig);
} catch {
  // If Firebase is already initialized, get the existing app
  console.warn("Firebase already initialized, using existing app");
  app = initializeApp(firebaseConfig, "propinfinia");
}

const storage = getStorage(app);

export async function uploadImage(file: File): Promise<{ path: string; url: string }> {
  try {
    const timestamp = Date.now();
    const path = `uploads/${timestamp}-${file.name}`;
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded file successfully:', snapshot);
    
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    console.log('File available at:', url);
    
    return { path, url };
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    } else {
      throw new Error('Failed to upload image: Unknown error');
    }
  }
}