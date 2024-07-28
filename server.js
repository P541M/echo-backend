const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  initFirebaseAndSetListeners,
  addMessage,
  clearMessages,
} = require("./firebaseOperations");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let firebaseInitialized = false;
let database, messagesRef, intervalId;

app.get("/initialize-firebase", async (req, res) => {
  if (!firebaseInitialized) {
    const firebaseInit = initFirebaseAndSetListeners();
    database = firebaseInit.database;
    messagesRef = firebaseInit.messagesRef;
    intervalId = firebaseInit.intervalId;
    firebaseInitialized = true;
  }
  res.json({ message: "Firebase initialized successfully" });
});

app.post("/add-message", async (req, res) => {
  try {
    const { message } = req.body;
    await addMessage(message);
    res.status(200).json({ message: "Message added successfully" });
  } catch (error) {
    console.error("Error in /add-message:", error);
    res
      .status(500)
      .json({ error: "Failed to add message", details: error.message });
  }
});

app.post("/clear-messages", async (req, res) => {
  try {
    await clearMessages();
    res.status(200).json({ message: "Messages cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear messages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
