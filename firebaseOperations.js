const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  get,
  update,
} = require("firebase/database");
const dotenv = require("dotenv");

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const initFirebaseAndSetListeners = () => {
  const messagesRef = ref(database, "messages");
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Messages:", data);
  });
};

const addMessage = async (message) => {
  const messagesRef = ref(database, "messages");
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    text: message,
    timestamp: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
  });
};

const getMessages = async () => {
  const messagesRef = ref(database, "messages");
  const snapshot = await get(messagesRef);
  const messages = snapshot.val();

  // Ensure likedBy property is defined
  for (const key in messages) {
    if (!messages[key].likedBy) {
      messages[key].likedBy = [];
    }
  }

  return messages;
};

const clearMessages = async () => {
  const messagesRef = ref(database, "messages");
  await remove(messagesRef);
};

const likeMessage = async (messageId, userId) => {
  const messageRef = ref(database, `messages/${messageId}`);
  const snapshot = await get(messageRef);
  const messageData = snapshot.val();
  if (messageData.likedBy.includes(userId)) {
    // Unlike the message
    const updates = {
      likes: messageData.likes - 1,
      likedBy: messageData.likedBy.filter((id) => id !== userId),
    };
    await update(messageRef, updates);
  } else {
    // Like the message
    const updates = {
      likes: messageData.likes + 1,
      likedBy: [...messageData.likedBy, userId],
    };
    await update(messageRef, updates);
  }
};

module.exports = {
  initFirebaseAndSetListeners,
  addMessage,
  clearMessages,
  getMessages,
  likeMessage,
};
