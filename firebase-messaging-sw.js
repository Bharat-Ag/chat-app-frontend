importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDmXvEh8ndIVy96r-jUtP52IR0qOuNEJWc",
    authDomain: "chit-chat-f9040.firebaseapp.com",
    projectId: "chit-chat-f9040",
    storageBucket: "chit-chat-f9040.firebasestorage.app",
    messagingSenderId: "455699463992",
    appId: "1:455699463992:web:a2716d546625156c7acbcd",
    measurementId: "G-SZTP701FBF",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
