import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'

// Add Firebase products that you want to use
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'
console.log("hello firebase");
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsJJJOD8xc7ybBdzts6gzEJnljCLPxoCQ",
  authDomain: "sowmi-n.firebaseapp.com",
  projectId: "sowmi-n",
  storageBucket: "sowmi-n.firebasestorage.app",
  messagingSenderId: "166505870099",
  appId: "1:166505870099:web:ee96129d66e8853aa960e6",
  measurementId: "G-FYYY4F5C8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(app);
console.log(auth);

async function loginWithFirebase(event) {
    event.preventDefault();
    console.log(event);
    let emailInput = document.querySelector("input[type='email']");
    let passwordInput = document.querySelector("input[type='password']");
    let email = emailInput.value;
    let password = passwordInput.value;
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        window.location.href = "home.html";
    }
    catch(error) {
        console.log("Login failed");
        console.log(error);
    }
}

const loginForm = document.getElementsByTagName("form")[0];
loginForm.addEventListener("submit", loginWithFirebase);
