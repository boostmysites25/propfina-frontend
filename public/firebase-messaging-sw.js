// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0MheWwPrtinGAkQpaDqKcUBh0FEY-9rs",
  authDomain: "propinfinia-b1452.firebaseapp.com",
  projectId: "propinfinia-b1452",
  storageBucket: "propinfinia-b1452.appspot.com",
  messagingSenderId: "32116602272",
  appId: "1:32116602272:web:07e1d4dba017f219ef20c5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const { notification, data } = payload;
  
  const notificationTitle = notification?.title || 'New Notification';
  const notificationOptions = {
    body: notification?.body || 'You have a new notification',
    icon: '/vite.svg', // Your app icon
    badge: '/vite.svg',
    tag: 'propinfinia-notification',
    data: data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/vite.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow('/dashboard');
        }
      })
    );
  }
  // 'dismiss' action or default click just closes the notification
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
}); 