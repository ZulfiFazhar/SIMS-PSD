import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCVByNq7brTIA4RV9JyJhUWzHNE9tD_OxU",
    authDomain: "inkubator-ac13c.firebaseapp.com",
    projectId: "inkubator-ac13c",
    storageBucket: "inkubator-ac13c.firebasestorage.app",
    messagingSenderId: "367737445216",
    appId: "1:367737445216:web:8cb6470290df7af0b5dc05",
    measurementId: "G-MM3549PTEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
