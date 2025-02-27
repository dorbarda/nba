// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbWu0ldb3trZ_Jc-zCKjwb20rLp7r0O78",
  authDomain: "nba-predictions-3b937.firebaseapp.com",
  databaseURL: "https://nba-predictions-3b937-default-rtdb.firebaseio.com",
  projectId: "nba-predictions-3b937",
  storageBucket: "nba-predictions-3b937.firebasestorage.app",
  messagingSenderId: "57850435309",
  appId: "1:57850435309:web:611165ac081e392470dee4",
  measurementId: "G-TMQLMWGNJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };