// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJnBJDnb4F6yfRUAZecsX-GPiXmrO6K3o",
  authDomain: "working-ba4f3.firebaseapp.com",
  databaseURL:
    "https://working-ba4f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "working-ba4f3",
  storageBucket: "working-ba4f3.appspot.com",
  messagingSenderId: "170127063382",
  appId: "1:170127063382:web:d90e7415f30a11bb00bef7",
  measurementId: "G-TTHR04NDRL",
};

// Fetch all users from Realtime Database and populate table
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fetch all users from Realtime Database and populate table
// Function to fetch and update user list
function fetchAndUpdateUserList() {
  const userList = document.getElementById("userList");
  userList.innerHTML = ""; // Clear existing content before updating

  database
    .ref("users")
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val();
      for (const userId in users) {
        if (Object.hasOwnProperty.call(users, userId)) {
          const user = users[userId];
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${user.email}</td>
              <td>${user.firstName}</td>
              <td>${user.password}</td>
            `;
          userList.appendChild(row);
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

// Event listener for refresh button
document.addEventListener("DOMContentLoaded", function () {
  const refreshBtn = document.getElementById("refreshBtn");

  refreshBtn.addEventListener("click", function () {
    fetchAndUpdateUserList(); // Call the function to fetch and update user list
  });

  // Initial fetch and update user list
  fetchAndUpdateUserList();
});

document.addEventListener("DOMContentLoaded", function () {
  const addUserBtn = document.getElementById("addUserBtn");
  const overlay = document.getElementById("overlay");
  const closeOverlayBtn = document.getElementById("closeOverlay");

  addUserBtn.addEventListener("click", function () {
    overlay.style.display = "block";
  });

  closeOverlayBtn.addEventListener("click", function () {
    overlay.style.display = "none";
  });
});

// Initialize Firebase

const auth = firebase.auth();

// Register event listener for authentication state changes
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    console.log("User is signed in");
  } else {
    // No user is signed in.
    console.log("No user is signed in");
  }
});

const registrationForm = document.getElementById("addUserForm");

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get form values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Create user with email and password
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Signed in
      const user = userCredential.user;
      // Save additional user data to database
      saveUserData(user.uid, firstName, lastName, email, password);
      alert("Registration successful");
      registrationForm.reset(); // Reset the form
    })
    .catch(function (error) {
      // Handle errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error:", errorMessage);
      alert("Error: " + errorMessage);
    });
});

function saveUserData(uid, firstName, lastName, email, password) {
  // Save user data to database
  firebase
    .database()
    .ref("users/" + firstName)
    .set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
}
