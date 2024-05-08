document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  // NOTE: Replace the following config object with your Firebase project's configuration.
  const firebaseConfig = {
    apiKey: "AIzaSyDFktBVAU-JFluYqI1-iZTX_2OhOnFcxO8",
    authDomain: "admin-cc5d2.firebaseapp.com",
    databaseURL:
      "https://admin-cc5d2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "admin-cc5d2",
    storageBucket: "admin-cc5d2.appspot.com",
    messagingSenderId: "668428310619",
    appId: "1:668428310619:web:6352a58dbb69ff9964c77e",
    measurementId: "G-RWFEF9JGMZ",
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
