import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Register
const regBtn = document.getElementById("registerBtn");
if (regBtn) {
  regBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const errorBox = document.getElementById("error-message");

    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => {
        alert("Registered successfully!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          errorBox.textContent = "Email already registered.";
        } else if (error.code === "auth/invalid-email") {
          errorBox.textContent = "Please enter a valid email.";
        } else if (error.code === "auth/weak-password") {
          errorBox.textContent = "Password should be at least 6 characters.";
        } else {
          errorBox.textContent = error.message;
        }
      });
  });
}


// Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        //alert("Login successful!");
        window.location.href = "index.html"; // Redirect to home
      })
      .catch((error) => {
      const errorMessage = document.getElementById("error-message");
      if (error.code === "auth/wrong-password") {
        errorMessage.textContent = "Wrong password. Please try again.";
      } else if (error.code === "auth/user-not-found") {
      errorMessage.textContent = "User not found. Please check your email.";
      } else {
        errorMessage.textContent = "Login failed, wrong password :(";
      }
});
  });
}
