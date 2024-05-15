// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1FoY5QKv5IDV3JwodFluBQviAaOmbbJY",
  authDomain: "consultancy-d2595.firebaseapp.com",
  projectId: "consultancy-d2595",
  storageBucket: "consultancy-d2595.appspot.com",
  messagingSenderId: "505213876666",
  appId: "1:505213876666:web:3163175747a6ecdeeb0583",
  measurementId: "G-QRXW91CH92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB=getFirestore(app);
const analytics = getAnalytics(app);
export {fireDB,auth}