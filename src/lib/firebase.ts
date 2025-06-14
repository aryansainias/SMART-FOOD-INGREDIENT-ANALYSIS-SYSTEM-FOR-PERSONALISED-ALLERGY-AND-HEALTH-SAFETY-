import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqmVFe7-rf5V_o0kowGaOyBZIcbZrrlGE",
  authDomain: "smart-food-app-d3c32.firebaseapp.com",
  projectId: "smart-food-app-d3c32",
  storageBucket: "smart-food-app-d3c32.firebasestorage.app",
  messagingSenderId: "581301239235",
  appId: "1:581301239235:web:a4ccda18bd03bd021c5176",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
