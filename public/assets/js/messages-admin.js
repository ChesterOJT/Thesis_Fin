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

function listenForConversations() {
  const conversationsRef = firebase.database().ref("conversations");
  conversationsRef.on("value", function (snapshot) {
    const conversations = snapshot.val();
    const select = document.getElementById("conversationSelect");
    select.innerHTML = ""; // Clear existing options
    for (let id in conversations) {
      let option = document.createElement("option");
      option.value = id;
      option.textContent = id; // Use conversation ID or any identifier
      select.appendChild(option);
    }
  });
}

document
  .getElementById("conversationSelect")
  .addEventListener("change", function () {
    const selectedConversation = this.value;
    listenForMessages(selectedConversation);
  });

let currentMessagesRef = null; // This variable will hold the current Firebase reference to messages

function listenForMessages(conversationId) {
  // Clear existing messages display
  document.getElementById("messages").innerHTML = "";

  if (currentMessagesRef) {
    currentMessagesRef.off("child_added");
  }

  currentMessagesRef = firebase
    .database()
    .ref("conversations/" + conversationId + "/messages");
  currentMessagesRef.on("child_added", function (snapshot) {
    const messageData = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.textContent = messageData.sender + ": " + messageData.text;
    document.getElementById("messages").appendChild(messageElement);
  });
}

function sendMessage() {
  const conversationId = document.getElementById("conversationSelect").value;
  if (!conversationId) {
    alert("No conversation selected!");
    return;
  }
  console.log("Sending to conversation ID:", conversationId); // Debug log

  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;
  messageInput.value = ""; // Clear the input after sending

  const userEmail = localStorage.getItem("userEmail") || "Unknown";
  const timestamp = new Date().toISOString();
  const messageKey = timestamp.replace(/[^0-9]/g, "");

  const messageObject = {
    sender: userEmail,
    text: messageText,
    timestamp: timestamp,
  };

  const newMessageRef = firebase
    .database()
    .ref("conversations/" + conversationId + "/messages/" + messageKey);
  newMessageRef
    .set(messageObject)
    .then(() => {
      console.log("Message sent to:", conversationId); // Confirm message path
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}
listenForConversations(); // Initial call to load conversations
