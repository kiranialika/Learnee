import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmsJwy3jc31AXyD-e5YI53CWeoeXki6pw",
  authDomain: "learnee-54058.firebaseapp.com",
  projectId: "learnee-54058",
  storageBucket: "learnee-54058.firebasestorage.app",
  messagingSenderId: "1021985916688",
  appId: "1:1021985916688:web:c2cbbeaa48adbeee660795"
};

export const auth = getAuth(initializeApp(firebaseConfig));