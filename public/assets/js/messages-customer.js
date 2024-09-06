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

firebase.initializeApp(firebaseConfig);

document.getElementById("adminSelect").addEventListener("change", function () {
  localStorage.setItem("recipientAdmin", this.value); // Store selected admin email in localStorage
});

function sendMessage() {
  const customerEmail = localStorage.getItem("userEmail");
  const adminEmail = localStorage.getItem("recipientAdmin");
  if (!adminEmail) {
    alert("No admin selected!");
    return;
  }

  const messageText = document.getElementById("messageInput").value;
  const conversationId = generateConversationId(customerEmail, adminEmail); // Now sanitizes the email
  const timestamp = new Date().toISOString();
  const messageKey = timestamp.replace(/[^0-9]/g, ""); // Use timestamp as key

  const messageObject = {
    sender: customerEmail,
    text: messageText,
    timestamp: timestamp,
  };

  const newMessageRef = firebase
    .database()
    .ref("conversations/" + conversationId + "/messages/" + messageKey);
  newMessageRef.set(messageObject);
}

// Example usage, assuming the sender is the customer and the input for the message is available
document.getElementById("sendButton").addEventListener("click", function () {
  const customerEmail = localStorage.getItem("userEmail"); // Assuming customer's email is stored
  const messageText = document.getElementById("messageInput").value;
  sendMessage(customerEmail, messageText);
});
function listenForMessages() {
  const customerEmail = localStorage.getItem("userEmail");
  const adminEmail = localStorage.getItem("recipientAdmin");
  if (!adminEmail) {
    console.log("No admin selected for listening!");
    return;
  }

  const conversationId = generateConversationId(customerEmail, adminEmail);
  const messagesRef = firebase
    .database()
    .ref("conversations/" + conversationId + "/messages");
  messagesRef.on("child_added", function (snapshot) {
    const messageData = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.textContent = messageData.sender + ": " + messageData.text;
    document.getElementById("messages").appendChild(messageElement);
  });
}

function generateConversationId(senderEmail, recipientEmail) {
  // Replace periods with underscores to prevent Firebase path errors
  return senderEmail.replace(/\./g, "_");
}
// Start listening when the page loads or when the admin is selected
listenForMessages();
