// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getFunctions } from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyDGEqC0-qIAWKjRUtaK5bEFhfvfeTydtrE",
  authDomain: "vydio-db876.firebaseapp.com",
  projectId: "vydio-db876",
  appId: "1:890640766616:web:5497a8d00d3fe9d75162ed",
  measurementId: "G-6WKJY73WJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const functions = getFunctions();

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, provider);
}

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}

export const signOut = async () => {
  return auth.signOut();
}