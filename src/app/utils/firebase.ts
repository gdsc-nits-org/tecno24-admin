// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQQSh1SzfH2g_5qFUr_s6AbwFAkzl71Bo",
  authDomain: "tecnoesis-api.firebaseapp.com",
  projectId: "tecnoesis-api",
  storageBucket: "tecnoesis-api.appspot.com",
  messagingSenderId: "469689094900",
  appId: "1:469689094900:web:f48700045a45f6f608c4a1",
  measurementId: "G-1SB1EPQGFX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth()


export {app, auth}