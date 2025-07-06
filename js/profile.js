import { auth } from "./firebase-config.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const navImg = document.getElementById("profileImage");
  const formImg = document.getElementById("profileEditImage");
  const nameInput = document.getElementById("usernameInput");
  const photoInput = document.getElementById("photoInput");
  const form = document.getElementById("profileForm");
  const msg = document.getElementById("profile-msg");

  // Initialize from Firebase or localStorage
  const savedPic = localStorage.getItem("profilePic");
  const savedName = localStorage.getItem("profileName");
  if (auth.currentUser) {
    navImg.src = auth.currentUser.photoURL || savedPic || navImg.src;
    formImg.src = auth.currentUser.photoURL || savedPic || formImg.src;
    const name = auth.currentUser.displayName || savedName || "";
    document.getElementById("profileName").textContent = name;
    nameInput.value = name;
  } else {
    if (savedPic) {
      navImg.src = savedPic;
      formImg.src = savedPic;
    }
    if (savedName) {
      nameInput.value = savedName;
      document.getElementById("profileName").textContent = savedName;
    }
  }

  // Preview new photo
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (formImg.src = reader.result);
    reader.readAsDataURL(file);
  });

  // Save changes
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "mt-3 text-center";

    const newName = nameInput.value.trim();
    const file = photoInput.files[0];

    if (!newName && !file) {
      msg.textContent = "No changes to save.";
      msg.classList.add("text-warning");
      return;
    }

    // Update displayName
    if (newName) {
      localStorage.setItem("profileName", newName);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName });
      }
      document.getElementById("profileName").textContent = newName;
    }

    // Update photoURL
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const url = reader.result;
        localStorage.setItem("profilePic", url);
        navImg.src = url;
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: url });
        }
        msg.textContent = "Profile updated!";
        msg.classList.add("text-success");
      };
      reader.readAsDataURL(file);
    } else {
      msg.textContent = "Profile updated!";
      msg.classList.add("text-success");
    }
  });
});
