// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { 
  getAuth,
  // Import all the auth functions you need
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuH5CfFnjxpxejqWpgxU6gguFesrxHhVc",
  authDomain: "ai-email-analyzer-7332a.firebaseapp.com",
  projectId: "ai-email-analyzer-7332a",
  storageBucket: "ai-email-analyzer-7332a.firebasestorage.app",
  messagingSenderId: "16277432073",
  appId: "1:16277432073:web:05029c4f55fc82c74595d8",
  measurementId: "G-SFSY4K81BZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Export everything you need, including the functions
export {
  auth,
  db,
  functions,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};