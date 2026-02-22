// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAZZsq1nIVXZcCK8o2zu69bN_h_ytgfDEM",
    authDomain: "sowocaz.firebaseapp.com",
    projectId: "sowocaz",
    storageBucket: "sowocaz.firebasestorage.app",
    messagingSenderId: "671415941870",
    appId: "1:671415941870:web:375fbd5b4e2b8b27d8d1ff"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);