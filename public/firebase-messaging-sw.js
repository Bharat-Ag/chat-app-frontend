importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCbX8X2R5ak0H4hQPvq8H5nnvAEKiqS6xI",
    authDomain: "chit-chat-feb8c.firebaseapp.com",
    projectId: "chit-chat-feb8c",
    storageBucket: "chit-chat-feb8c.firebasestorage.app",
    messagingSenderId: "299190691975",
    appId: "1:299190691975:web:d6217919d8cbe89a463022",
    measurementId: "G-0J9L018GQE"
});

const messaging = firebase.messaging();

// Fires when a push arrives and no app tab is focused (app/browser closed or backgrounded).
messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification?.title || "New message";
    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: payload.notification?.icon || "/vite.svg",
        data: payload.data || {},
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Clicking the notification focuses an existing app tab (or opens one),
// and posts the senderId so the app can open the right chat.
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const senderId = event.notification.data?.senderId;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    if (senderId) client.postMessage({ type: 'OPEN_CHAT', senderId });
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});
