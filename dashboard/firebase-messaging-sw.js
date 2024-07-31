importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDzZhOouePIuPy7tg0gub-1oavd2iMtU2A",
  authDomain: "duvdu2024.firebaseapp.com",
  projectId: "duvdu2024",
  storageBucket: "duvdu2024.appspot.com",
  messagingSenderId: "475213071438",
  appId: "1:475213071438:web:6cf4abad7b3bf9cc72af1f",
  measurementId: "G-N1TMFWJPLY"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
