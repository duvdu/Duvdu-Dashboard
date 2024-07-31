import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDzZhOouePIuPy7tg0gub-1oavd2iMtU2A",
    authDomain: "duvdu2024.firebaseapp.com",
    projectId: "duvdu2024",
    storageBucket: "duvdu2024.appspot.com",
    messagingSenderId: "475213071438",
    appId: "1:475213071438:web:6cf4abad7b3bf9cc72af1f",
    measurementId: "G-N1TMFWJPLY"
    };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
