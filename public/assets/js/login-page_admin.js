document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  // NOTE: Replace the following config object with your Firebase project's configuration.
  const firebaseConfig = {
    apiKey: "AIzaSyAJnBJDnb4F6yfRUAZecsX-GPiXmrO6K3o",
    authDomain: "working-ba4f3.firebaseapp.com",
    projectId: "working-ba4f3",
    storageBucket: "working-ba4f3.appspot.com",
    databaseURL:
      "https://working-ba4f3-default-rtdb.asia-southeast1.firebasedatabase.app/",
    messagingSenderId: "170127063382",
    appId: "1:170127063382:web:d90e7415f30a11bb00bef7",
    measurementId: "G-TTHR04NDRL",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const dbRef = firebase.database().ref();

  const loginForm = document.getElementById("loginform");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Convert email to a valid Firebase key (e.g., replace '.' with ',')
    const emailKey = email.replace(/\./g, ",");

    // Hash the password input to compare with the database
    const hashedPassword = hashPassword(password); // You need to implement hashPassword

    // Query the database for the user
    dbRef
      .child("admin/" + emailKey)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.val();
          if (hashedPassword === user.password) {
            localStorage.setItem("userEmail", email); // Store email in localStorage
            window.location.href = "./../home/home-admin.html"; // Redirect
          } else {
            alert("Incorrect password");
          }
        } else {
          alert("No user found with this email");
        }
      })
      .catch((error) => {
        console.error("Database query error:", error);
        alert("Error: " + error.message);
      });
  });
});
function hashPassword(password) {
  return btoa(password); // Converts the password string to base64
}
document.getElementById("textInput").addEventListener("focus", function () {
  document.getElementById("envelopeIcon").style.color = "lightblue";
});

document.getElementById("textInput").addEventListener("blur", function () {
  document.getElementById("envelopeIcon").style.color = "#000"; // Change back to initial color when focus is lost
});

const passwordInput = document.getElementById("passwordInput");
const eyeIcon = document.getElementById("eyeIcon");

eyeIcon.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("bx-show");
    eyeIcon.classList.add("bx-hide");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("bx-hide");
    eyeIcon.classList.add("bx-show");
  }
});
