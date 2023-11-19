// config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFcf4ME0rt-m0kx2HDojUeZMGV50iM83Q",
    authDomain: "bookmate-5569d.firebaseapp.com",
    projectId: "bookmate-5569d",
    storageBucket: "bookmate-5569d.appspot.com",
    messagingSenderId: "386502262526",
    appId: "1:386502262526:web:b573f5f648140b76ac6faf",
    measurementId: "G-VPZ14LFMQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
