import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE6mV7C2nf_-IHdBEsLBefZaMomNPC82E",
  authDomain: "mangobluster-8d258.firebaseapp.com",
  projectId: "mangobluster-8d258",
  storageBucket: "mangobluster-8d258.firebasestorage.app",
  messagingSenderId: "653821344518",
  appId: "1:653821344518:web:9e162f97bbdafa9e59bc87",
  measurementId: "G-P8ZZ65SQ4W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
