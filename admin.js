import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'

// Add Firebase products that you want to use
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'
import { getFirestore, collection, getDocs, Timestamp, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
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
let admin = "admin@admin.com"
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        // Update UI to show logged-in state
        console.log(user);
        console.log(user.email);
        if(user.email === admin) {
            console.log("admin logged in access granted");
        } else {
            console.log("access denied");
            logout();
            window.location.href = "login.html";
        }
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
console.log("hello world");
let courseNameE = document.getElementById("course-name");
let startDateE = document.getElementById("start-date");
let endDateE = document.getElementById("end-date");
let studentTableE = document.getElementById("students-table");

// addEventListener to start date so the end date is automatically set to
// six days after to the start date since that is probably what we want
// and a normal class schedule is 6 days.
function setEndDate() {
    console.log(this.value);
    console.log(new Date(this.value));
}
startDateE.addEventListener("input", setEndDate);

// fetch the course name to fill course name select.
let fireStore = getFirestore();
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
getCourseData();

// initialize the default data variables
let courseName = "";
let startDate = new Date();
let endDate = new Date();
const today = startDate;
endDate.setDate(today.getDate() + 1);
// set the default values for the form controls

startDateE.value = startDate.toISOString().split("T")[0];
endDateE.value = endDate.toISOString().split("T")[0];

// Fetch the students details and show them in the table
async function filterStudents() {
    courseName = courseNameE.options[courseNameE.selectedIndex].value;
    startDate = startDateE.value;
    endDate = endDateE.value;
    let fireStoreStartDate = Timestamp.fromDate(new Date(startDate));
    let fireStoreEndDate = Timestamp.fromDate(new Date(endDate));
    // create the first row
    let fr = document.createElement("tr");

    let snoTD = document.createElement("td")            
    let nameTD = document.createElement("td")           
    let rollNoTD = document.createElement("td")         
    let projectTitleTD = document.createElement("td")   
    let projectUrlTD = document.createElement("td")     
    let projectDescTD = document.createElement("td")    
    let submitTimeTD = document.createElement("td")     

    snoTD.appendChild(document.createTextNode("Sno."));
    nameTD.appendChild(document.createTextNode("Name"));
    rollNoTD.appendChild(document.createTextNode("Roll No."));
    projectTitleTD.appendChild(document.createTextNode("Project Title"));
    projectUrlTD.appendChild(document.createTextNode("Project Url"));
    projectDescTD.appendChild(document.createTextNode("Project Description"));
    submitTimeTD.appendChild(document.createTextNode("Submitted On"));

    fr.appendChild(snoTD);
    fr.appendChild(nameTD);
    fr.appendChild(rollNoTD);
    fr.appendChild(projectTitleTD);
    fr.appendChild(projectUrlTD);
    fr.appendChild(projectDescTD);
    fr.appendChild(submitTimeTD);
    studentTableE.appendChild(fr);
    const q = query(collection(fireStore, "student-projects"), where("course-name", "==", courseName), where("timestamp", ">=", fireStoreStartDate), where("timestamp", "<=", fireStoreEndDate));
    const querySnapshot = await getDocs(q);
    let sno = 1;
    querySnapshot.forEach((doc) => {
        console.dir(doc.data());
        let tr = document.createElement("tr");

        let name = doc.data()["student-name"];
        let rollNo = doc.data()["roll-number"];
        let projectTitle = doc.data()["project-title"];
        let projectUrl = doc.data()["project-url"];
        let projectDesc = doc.data()["project-description"];
        let submitTime = doc.data()["timestamp"].toDate();
        // Create table data
        let snoTD = document.createElement("td")
        let nameTD = document.createElement("td")
        let rollNoTD = document.createElement("td")
        let projectTitleTD = document.createElement("td")
        let projectUrlTD = document.createElement("td")
        let projectDescTD = document.createElement("td")
        let submitTimeTD = document.createElement("td")

        snoTD.appendChild(document.createTextNode(sno+""));
        nameTD.appendChild(document.createTextNode(name));
        rollNoTD.appendChild(document.createTextNode(rollNo));
        projectTitleTD.appendChild(document.createTextNode(projectTitle));
        let a = document.createElement("a");
        a.href = projectUrl;
        a.target = "_blank";
        a.appendChild(document.createTextNode(projectUrl));
        projectUrlTD.appendChild(a);
        let textarea = document.createElement("textarea");
        textarea.disabled = "true";
        textarea.value = projectDesc;
        projectDescTD.appendChild(textarea);
        projectDescTD.id = "pd";
        let date = document.createElement("input");
        date.type = "date";
        date.value = submitTime.toISOString().split("T")[0];
        submitTimeTD.appendChild(date);

        tr.appendChild(snoTD);
        tr.appendChild(nameTD);
        tr.appendChild(rollNoTD);
        tr.appendChild(projectTitleTD);
        tr.appendChild(projectUrlTD);
        tr.appendChild(projectDescTD);
        tr.appendChild(submitTimeTD);

        studentTableE.appendChild(tr);
        sno++;
    });
}

setTimeout(() => filterStudents(), 3000);
