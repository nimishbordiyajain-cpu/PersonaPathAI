import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCe4UH5WyY3YWzyPvGVuk5L7_6S849WyQo",
  authDomain: "neeluuuuu-ba023.firebaseapp.com",
  projectId: "neeluuuuu-ba023",
  storageBucket: "neeluuuuu-ba023.firebasestorage.app",
  messagingSenderId: "616052081310",
  appId: "1:616052081310:web:772af18e89c121ab24f18f",
  measurementId: "G-RKZLB64CKB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);