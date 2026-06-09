// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI6-DVN-hcYyGrysZI04EUlZS_OSXG_d8",
  authDomain: "aiml-19a23.firebaseapp.com",
  projectId: "aiml-19a23",
  storageBucket: "aiml-19a23.firebasestorage.app",
  messagingSenderId: "73860491295",
  appId: "1:73860491295:web:287b545dc80df4ab044d2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;
