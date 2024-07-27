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

app.get("/api-key", (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_API_KEY });
});

app.get("/initialize-firebase", async (req, res) => {
  try {
    const { database, messagesRef, intervalId } =
      await initFirebaseAndSetListeners();
    res.json({ database, messagesRef, intervalId });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize Firebase" });
  }
});

app.post("/add-message", async (req, res) => {
  try {
    const { message } = req.body;
    await addMessage(message); // Assuming addMessage function is updated to take only message
    res.status(200).json({ message: "Message added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add message" });
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
