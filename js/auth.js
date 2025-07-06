// /js/auth.js
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// — REGISTER —
const regBtn = document.getElementById("registerBtn");
if (regBtn) {
  regBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const errorBox = document.getElementById("error-message");

    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCred) => {
        // assign default username & avatar
        return updateProfile(userCred.user, {
          displayName: email.split("@")[0],
          photoURL: "Images/default-profile-pic.jpg",
        });
      })
      .then(() => (window.location.href = "login.html"))
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          errorBox.textContent = "Email already registered.";
        } else if (err.code === "auth/invalid-email") {
          errorBox.textContent = "Please enter a valid email.";
        } else if (err.code === "auth/weak-password") {
          errorBox.textContent = "Password should be at least 6 characters.";
        } else {
          errorBox.textContent = err.message;
        }
      });
  });
}

// — LOGIN —
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const errorBox = document.getElementById("error-message");

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => (window.location.href = "index.html"))
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          errorBox.textContent = "No account with that email.";
        } else if (err.code === "auth/wrong-password") {
          errorBox.textContent = "Incorrect password.";
        } else {
          errorBox.textContent = err.message;
        }
      });
  });
}

// — HEADER SWAP & LOGOUT —
onAuthStateChanged(auth, (user) => {
  const authButtons = document.getElementById("authButtons");
  const profileContainer = document.getElementById("profileContainer");
  const profileImg = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");

  if (user) {
    authButtons.classList.add("d-none");
    profileContainer.classList.remove("d-none");
    profileImg.src = user.photoURL || "Images/default-profile-pic.jpg";
    profileName.textContent = user.displayName || user.email;
  } else {
    authButtons.classList.remove("d-none");
    profileContainer.classList.add("d-none");
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => (window.location.href = "login.html"));
  });
}
