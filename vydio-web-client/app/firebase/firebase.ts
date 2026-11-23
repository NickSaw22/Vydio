// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGEqC0-qIAWKjRUtaK5bEFhfvfeTydtrE",
  authDomain: "vydio-db876.firebaseapp.com",
  projectId: "vydio-db876",
//   storageBucket: "vydio-db876.firebasestorage.app",
//   messagingSenderId: "890640766616",
  appId: "1:890640766616:web:5497a8d00d3fe9d75162ed",
  measurementId: "G-6WKJY73WJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);