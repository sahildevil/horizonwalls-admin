// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ-29aQaBCamoSxzJzF37lCWoTLeZEPlI",
  authDomain: "horizonwalls-1cd22.firebaseapp.com",
  projectId: "horizonwalls-1cd22",
  storageBucket: "horizonwalls-1cd22.firebasestorage.app",
  messagingSenderId: "602015872082",
  appId: "1:602015872082:web:4f9becfdbaa52bb32d5b8b",
  measurementId: "G-5ZCVJX98CC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
