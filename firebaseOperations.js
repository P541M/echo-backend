const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  get,
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
  });
};

const getMessages = async () => {
  const messagesRef = ref(database, "messages");
  const snapshot = await get(messagesRef);
  return snapshot.val();
};

const clearMessages = async () => {
  const messagesRef = ref(database, "messages");
  await remove(messagesRef);
};

module.exports = {
  initFirebaseAndSetListeners,
  addMessage,
  clearMessages,
  getMessages,
};
