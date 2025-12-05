// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1JUhXddaMilr3lhPMQBIMcY1_qlKcb_0",
  authDomain: "strickly.firebaseapp.com",
  projectId: "strickly",
  storageBucket: "strickly.firebasestorage.app",
  messagingSenderId: "277355716853",
  appId: "1:277355716853:web:1da506a08366bda50965bc",
  measurementId: "G-4N0BWH7MLP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Auth with error handling for React Native
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  console.log('Firebase Auth initialized successfully');
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    console.log('Firebase Auth already initialized, using existing instance');
  } else {
    console.error('Firebase Auth initialization error:', error);
    throw error;
  }
}

export { auth };
export type { Auth } from 'firebase/auth';
export const googleProvider = new GoogleAuthProvider();