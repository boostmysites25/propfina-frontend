import { initializeApp, getApps } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Firebase config (reuse from uploadImage.ts)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0MheWwPrtinGAkQpaDqKcUBh0FEY-9rs",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "propinfinia-b1452.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "propinfinia-b1452",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "propinfinia-b1452.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "32116602272",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:32116602272:web:07e1d4dba017f219ef20c5",
};


// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

import type { Messaging } from 'firebase/messaging';

let messaging: Messaging | null = null;

// Initialize messaging only in browser environment
export const initializeMessaging = (): Messaging | null => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
            messaging = getMessaging(app);
            return messaging;
        } catch (error) {
            console.error('Error initializing Firebase messaging:', error);
            return null;
        }
    }
    return null;
};

// Register service worker
export const registerServiceWorker = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};

// Simplified notification system to avoid Firebase compatibility issues
export const initializeNotifications = async (): Promise<void> => {
    try {
        console.log('🔔 Initializing notification system...');

        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('✅ Notification permission granted');
            console.log('🔔 Basic notification system initialized');

            // Show test notification
            new Notification('Propinfinia', {
                body: 'Notifications are now enabled!',
                icon: '/vite.svg',
            });
        } else {
            console.warn('⚠️ Notification permission denied');
        }
    } catch (error) {
        console.error('❌ Error initializing notification system:', error);
    }
};

// Placeholder functions for future Firebase integration
export const requestNotificationPermission = async (): Promise<string | null> => {
    console.log('Firebase messaging will be implemented after fixing compatibility issues');
    return null;
};

export const setupForegroundMessageListener = () => {
    console.log('Firebase messaging listener will be implemented later');
};

export const storeDeviceToken = async (token: string): Promise<boolean> => {
    console.log(token)
    console.log('Device token storage will be implemented later');
    return false;
}; 