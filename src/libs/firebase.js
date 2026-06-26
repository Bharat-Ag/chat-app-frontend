import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"


const firebaseConfig = {
  apiKey: "AIzaSyCbX8X2R5ak0H4hQPvq8H5nnvAEKiqS6xI",
  authDomain: "chit-chat-feb8c.firebaseapp.com",
  projectId: "chit-chat-feb8c",
  storageBucket: "chit-chat-feb8c.firebasestorage.app",
  messagingSenderId: "299190691975",
  appId: "1:299190691975:web:d6217919d8cbe89a463022",
  measurementId: "G-0J9L018GQE"
};


const app = initializeApp(firebaseConfig);
export const messaging = () => getMessaging(app)

export const generateToken = async () => {
  try {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    // Make sure our messaging service worker is registered before asking for a token.
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging(app), {
      vapidKey: "BItNMUT9HxJVYIjPkZ1vB5bk6WCmLtGu3BvgVO_Nr_EICNBWY3CIfaC0g1X-3l_XdVp49fzK3-dWgCEawOaCJfY",
      serviceWorkerRegistration: registration
    });

    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
}