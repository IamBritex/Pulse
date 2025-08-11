// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyCJLSlhwx-Fe_9Lmufv3ElFv-VS2iMI4Uo",
    authDomain: "pulse-e299f.firebaseapp.com",
    projectId: "pulse-e299f",
    storageBucket: "pulse-e299f.firebasestorage.app",
    messagingSenderId: "845914258695",
    appId: "1:845914258695:web:280096a9aaeb2beb4659a2",
    measurementId: "G-E91E0E4GVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);