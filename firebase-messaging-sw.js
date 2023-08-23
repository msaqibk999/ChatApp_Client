// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyC3bV5sobMGRLmoe1cyjzTmZWe74bJE4T0",
    authDomain: "chatapp-8c120.firebaseapp.com",
    projectId: "chatapp-8c120",
    storageBucket: "chatapp-8c120.appspot.com",
    messagingSenderId: "835502071052",
    appId: "1:835502071052:web:e4b3f878b00308d45c7d29",
    measurementId: "G-2LL9DS2344"
  };

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});