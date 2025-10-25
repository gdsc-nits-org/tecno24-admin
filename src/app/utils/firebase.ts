// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBOm88RowuTBraW8ruA6pOfRQzv5xf2ZIM",
  authDomain: "tecnoesis25.firebaseapp.com",
  projectId: "tecnoesis25",
  storageBucket: "tecnoesis25.firebasestorage.app",
  messagingSenderId: "873389209547",
  appId: "1:873389209547:web:e51d0397944f5a99ef284e",
  measurementId: "G-T4H1F9X9CY"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set persistence:", error);
});


export {app, auth}