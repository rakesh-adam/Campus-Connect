import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQZ3cWETtE30e4UvzUgbj9DDsBqr6B_s0",
  authDomain: "authexample-cd947.firebaseapp.com",
  projectId: "authexample-cd947",
  storageBucket: "authexample-cd947.firebasestorage.app",
  messagingSenderId: "456706357397",
  appId: "1:456706357397:web:5d06fb3e24788b32fdc39c",
  measurementId: "G-GC9QJNPDJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
