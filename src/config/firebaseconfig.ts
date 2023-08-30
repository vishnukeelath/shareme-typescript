// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { Auth } from "firebase/auth/cordova";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHhJ4UpSsOcfo1NR5RTkscrKAwtKZe2Ko",
  authDomain: "react-shareme-typescript.firebaseapp.com",
  projectId: "react-shareme-typescript",
  storageBucket: "react-shareme-typescript.appspot.com",
  messagingSenderId: "482758445085",
  appId: "1:482758445085:web:1072f8dac2c13c7408def4",
  measurementId: "G-QLZWB7ZKNJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth: Auth = getAuth(app);
export const firebaseProvider = new GoogleAuthProvider();
export const storage: FirebaseStorage = getStorage(app);
export const firestore = getFirestore(app);
