import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"


const firebaseConfig = {
  apiKey: "AIzaSyDmXvEh8ndIVy96r-jUtP52IR0qOuNEJWc",
  authDomain: "chit-chat-f9040.firebaseapp.com",
  projectId: "chit-chat-f9040",
  storageBucket: "chit-chat-f9040.firebasestorage.app",
  messagingSenderId: "455699463992",
  appId: "1:455699463992:web:a2716d546625156c7acbcd",
  measurementId: "G-SZTP701FBF"
};


const app = initializeApp(firebaseConfig);
export const messaging = () => getMessaging(app)

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging(app), {
        vapidKey: "BAz2JF6gKcbo-dlCs-9pTcWvC5pxGbkMqAYauTm_RPqkSRcya88TW1Jehh1MYNC-aIegGj0LjtChHN2BvtuU7dI",
        serviceWorkerRegistration: await navigator.serviceWorker.ready
      });

      return token
    }
  } catch (error) {
    console.error('Token generation error:', error);
  }
}