// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEH8RtPgNbx20itaVBW6h_tqaWbYjiNx0",
  authDomain: "house-marketplace-app-1b9bb.firebaseapp.com",
  projectId: "house-marketplace-app-1b9bb",
  storageBucket: "house-marketplace-app-1b9bb.appspot.com",
  messagingSenderId: "411471898761",
  appId: "1:411471898761:web:3b0d434deab5de323f3e58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
