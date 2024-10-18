import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { setLocalStorageItem } from './utils/helper';
import { isSupported } from 'firebase/messaging';
import { FIREBASE_MESSAGING_KEY } from './core/env.configs';

const firebaseConfig = {
  apiKey: 'AIzaSyBI9fC906yi7MSEhphNEQ1WJPAYj6tTla0',
  authDomain: 'shoorah-e87b6.firebaseapp.com',
  projectId: 'shoorah-e87b6',
  storageBucket: 'shoorah-e87b6.appspot.com',
  messagingSenderId: '607043867419',
  appId: '1:607043867419:web:4bf8486e2033c7bb2cb9be',
  measurementId: 'G-5MVVXH3EWH'
};

let messaging = null;
let firebaseApp;
isSupported()?.then(async (res) => {
  if (res) {
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
      console.log('Message received.', payload);
      // Customize notification here
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
      };
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }
});

export const requestForToken = async () => {
  const hasFirebaseMessagingSupport = await isSupported();
  if (hasFirebaseMessagingSupport) {
    try {
      let currentToken = null;
      if (Notification.permission === 'granted') {
        // Permission already granted
        currentToken = await getToken(messaging, {
          vapidKey: FIREBASE_MESSAGING_KEY
        });
      } else if (Notification.permission === 'default') {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          currentToken = await getToken(messaging, {
            vapidKey: FIREBASE_MESSAGING_KEY
          });
        } else {
          console.warn('Notification permission was not granted.');
        }
      } else {
        // Permission was denied
        console.warn('Notification permission was blocked.');
      }

      if (currentToken) {
        console.warn('Token found');
        setLocalStorageItem('deviceToken', currentToken);
        return true;
      } else {
        console.warn('Token not found');
        return false;
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return false;
    }
  } else {
    return false;
  }
};
