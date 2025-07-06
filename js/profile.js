// js/profile.js
document.addEventListener("DOMContentLoaded", () => {
  const navImg = document.getElementById("profileImage");
  const formImg = document.getElementById("profileEditImage");
  const nameInput = document.getElementById("usernameInput");
  const photoInput = document.getElementById("photoInput");
  const form = document.getElementById("profileForm");
  const msg = document.getElementById("profile-msg");

  // 1) Load any saved data
  const savedPic = localStorage.getItem("profilePic");
  const savedName = localStorage.getItem("profileName");
  if (savedPic) {
    navImg.src = savedPic;
    formImg.src = savedPic;
  }
  if (savedName) {
    nameInput.value = savedName;
    document.getElementById("profileName").textContent = savedName;
  }

  // 2) Preview a newly selected file
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      formImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // 3) Handle “Save Changes”
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "mt-3 text-center";

    const newName = nameInput.value.trim();
    const file = photoInput.files[0];

    // nothing changed?
    if (!newName && !file) {
      msg.textContent = "No changes to save.";
      msg.classList.add("text-warning");
      return;
    }

    // save name
    if (newName) {
      localStorage.setItem("profileName", newName);
      document.getElementById("profileName").textContent = newName;
    }

    // save photo
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("profilePic", reader.result);
        navImg.src = reader.result;
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
