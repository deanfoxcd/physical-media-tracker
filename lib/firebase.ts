import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYlD7_N1t8SwCJLN5HJS9D68-LKkJpXvI",
  authDomain: "physical-media-tracker-b75ee.firebaseapp.com",
  projectId: "physical-media-tracker-b75ee",
  storageBucket: "physical-media-tracker-b75ee.firebasestorage.app",
  messagingSenderId: "820738139647",
  appId: "1:820738139647:web:869244889dcdd5c54eb3ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
