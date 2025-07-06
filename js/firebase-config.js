import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; 
  
  const firebaseConfig = {
    apiKey: "AIzaSyA3LJYxtotlqs-jBnh1hjRhMXMdD6A86L8",
    authDomain: "fragrance-marketplace.firebaseapp.com",
    projectId: "fragrance-marketplace",
    storageBucket: "fragrance-marketplace.firebasestorage.app",
    messagingSenderId: "747201556499",
    appId: "1:747201556499:web:90f84c5421af8cb8070fe6",
    measurementId: "G-X5F2GPQGLF"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);