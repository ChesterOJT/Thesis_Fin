document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
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

  // Reference to the database service
  const database = firebase.database();

  // Register Form Submission
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Push user data to Firebase Realtime Database
    firebase
      .database()
      .ref("users")
      .push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      })
      .then(() => {
        alert("Registration successful!");
        console.log("Registration successful!");
        // Optionally, redirect the user to another page after successful registration.
        window.location.href = "./../login/login-page_cust.html";
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  });
});
