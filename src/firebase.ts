import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoBiHKmqTK-NslN8kECfmOxsPVM5GewfA",
  authDomain: "swe-arts.firebaseapp.com",
  projectId: "swe-arts",
  storageBucket: "swe-arts.firebasestorage.app",
  messagingSenderId: "938220626601",
  appId: "1:938220626601:web:a2b5bd7c02d8a8d5c6bfb8",
  measurementId: "G-75EZYFDGC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;