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

  // Reference to the form element
  const loginForm = document.getElementById("loginform");

  // Listen for form submit
  loginForm.addEventListener("submit", function (e) {
    // Prevent the default form submit behavior
    e.preventDefault();

    // Get the email and password from the form
    const email = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Sign in with email and password
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        // Redirect to the main page or dashboard
        window.location.href = "home.html"; // Change this URL to your main page
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display an error message to the user or log it
        console.error("Error signing in:", "Wrong Email or Password");
        alert("Error signing in: " + "Wrong Email or Password"); // Simple error alert, consider a more user-friendly approach
      });
  });
});
