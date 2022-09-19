import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApQ2v8b1mbmIG0hn4eLIPyZLyRVu_Uohw",
  authDomain: "chat-app-ff5d7.firebaseapp.com",
  projectId: "chat-app-ff5d7",
  storageBucket: "chat-app-ff5d7.appspot.com",
  messagingSenderId: "761732581892",
  appId: "1:761732581892:web:2c2e79907113ccbaf54351",
  measurementId: "G-4H6MXCS9NC"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app };