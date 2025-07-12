import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'

// Add Firebase products that you want to use
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
console.log("hello firebase");
// Import the functions you need from the SDKs you need

let g_user_email = "";
let g_user_uid = "";

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
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        // Update UI to show logged-in state
        console.log(user);
        g_user_email = user.email;
        g_user_uid = user.uid;
        let userName = document.getElementById("username");
        let userEmail = document.getElementById("useremail");
        userName.innerText = (user.displayName) ? user.displayName : ' ';
        userEmail.innerText = (user.email) ? user.email : ' ';
        // check if this user already submitted a project
        checkCourseData();
    } else {
        // User is signed out
        console.log('User is signed out');
        // Update UI to show logged-out state, e.g., show login form
        window.location.href = "login.html";
    }
});

async function logout() {
    try {
        await signOut(auth);
        console.log('User signed out');
        // Redirect to login page or update UI
    } catch (error) {
        console.error('Logout error:', error.message);
    }
}

let logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", logout);
let frm = document.getElementById("frm");
let res = document.getElementById("res");
frm.style.display = "none";
res.style.display = "none";
let resub = document.getElementById("resub");
resub.addEventListener("click", showForm);
let subfrm = document.getElementById("subfrm");
subfrm.addEventListener("submit", submitData);

let fireStore = getFirestore();
console.log(fireStore);

async function getCourseData() {
    let courseSelect = document.getElementById("course-name");
    const querySnapshot = await getDocs(collection(fireStore, "courses"));
    querySnapshot.forEach((doc) => {
        let courseOption = document.createElement("option");
        courseOption.appendChild(document.createTextNode(doc.data()["course-name"]));
        if(doc.data()["isActive"]) {
            courseOption.selected = true;
        }
        courseSelect.appendChild(courseOption);
    });
}
async function checkCourseData() {
    let frm = document.getElementById("frm");
    let res = document.getElementById("res");
    const q = query(collection(fireStore, "student-projects"), where("uid", "==", g_user_uid));
    const querySnapshot = await getDocs(q);
    let mindiff = 100;
    querySnapshot.forEach((doc) => {
        let created = doc.data().timestamp;
        let createdDate = created.toDate();
        let currentDate = new Date();
        console.dir(doc.data());
        let diff = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
        if(mindiff > diff) {
            mindiff = diff;
        }
    });
    if(mindiff <= 7) {
        // hide the article and show a submit new button
        frm.style.display = "none";
        res.style.display = "";
    }
    else {
        res.style.display = "none";
        frm.style.display = "";
    }
}
async function submitData(event) {
    event.preventDefault();
    let nameInput = document.getElementById("student-name");
    let rollNoInput = document.getElementById("roll-number");
    let projectTitleInput = document.getElementById("project-title");
    let projectDescriptionInput = document.getElementById("project-description");
    let projectUrlInput = document.getElementById("project-url");
    let courseNameInput = document.getElementById("course-name");
    try {
        const docRef = await addDoc(collection(fireStore, "student-projects"), {
            "course-name": courseNameInput.options[courseNameInput.selectedIndex].value,
            "email": g_user_email,
            "project-description": projectDescriptionInput.value,
            "project-title": projectTitleInput.value,
            "project-url": projectUrlInput.value,
            "roll-number": rollNoInput.value,
            "student-name": nameInput.value,
            "timestamp": serverTimestamp(),
            "uid": g_user_uid
        });
        console.log("Document written with ID: ", docRef.id);
        showRes();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
function showForm() {
    let frm = document.getElementById("frm");
    let res = document.getElementById("res");
    frm.style.display = "";
    res.style.display = "none";
}
function showRes() {
    let frm = document.getElementById("frm");
    let res = document.getElementById("res");
    res.style.display = "";
    frm.style.display = "none";
}
getCourseData();
