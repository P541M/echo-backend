const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const {
  initFirebaseAndSetListeners,
  addMessage,
  clearMessages,
  getMessages,
  likeMessage,
  muffleMessage,
} = require("./firebaseOperations");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let firebaseInitialized = false;

app.get("/initialize-firebase", async (req, res) => {
  if (!firebaseInitialized) {
    initFirebaseAndSetListeners();
    firebaseInitialized = true;
  }
  res.json({ message: "Firebase initialized successfully" });
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await getMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in /messages:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch messages", details: error.message });
  }
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

app.post("/like-message", async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    await likeMessage(messageId, userId);
    res.status(200).json({ message: "Message liked/unliked successfully" });
  } catch (error) {
    console.error("Error in /like-message:", error);
    res
      .status(500)
      .json({ error: "Failed to like/unlike message", details: error.message });
  }
});

// Schedule clearing messages at midnight ET
cron.schedule(
  "0 0 * * *",
  async () => {
    const now = new Date();
    const estOffset = 5 * 60 * 60 * 1000; // Offset for Eastern Standard Time (EST)
    const midnightET = new Date(now.setUTCHours(0, 0, 0, 0) + estOffset);

    if (now.getTime() === midnightET.getTime()) {
      console.log("Clearing messages at midnight ET");
      await clearMessages();
    }
  },
  {
    timezone: "America/New_York",
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/muffle-message", async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    await muffleMessage(messageId, userId);
    res.status(200).json({ message: "Message muffled successfully" });
  } catch (error) {
    console.error("Error in /muffle-message:", error);
    res
      .status(500)
      .json({ error: "Failed to muffle message", details: error.message });
  }
});
