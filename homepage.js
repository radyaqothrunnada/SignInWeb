import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyDwrmNibc3ANvEJEvmW5fj27ki05XaX1gI",
    authDomain: "todolistapps-9b9f1.firebaseapp.com",
    projectId: "todolistapps-9b9f1",
    storageBucket: "todolistapps-9b9f1.appspot.com",
    messagingSenderId: "443473623407",
    appId: "1:443473623407:web:b79819c1311284271d909a"
};
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();

  const aktivitas = document.getElementById('aktivitas');
  const waktu = document.getElementById('waktu');
  const listContainer = document.getElementById('list-container');
  const addTaskButton = document.getElementById('addTaskButton');
  const logoutButton = document.getElementById('logout');

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(loggedInUserId);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  function addTask() {
    if (aktivitas.value === '' || waktu.value === '') {
        alert("Aktivitas atau waktu tidak valid");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `${aktivitas.value} - ${waktu.value}`;
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.classList.add("close");
        li.appendChild(span);
        listContainer.appendChild(li);

        // Save task to Firestore in "activity" collection
        addDoc(collection(db, "activity"), {
            aktivitas: aktivitas.value,
            waktu: waktu.value,
            userId: loggedInUserId
        }).then(() => {
            console.log("Task added to Firestore");
        }).catch((error) => {
            console.error("Error adding task to Firestore:", error);
        });

        aktivitas.value = "";
        waktu.value = "";
        saveData();
    }
}

  function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
  }

  function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    let closeButtons = document.getElementsByClassName("close");
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function () {
            this.parentElement.remove();
            saveData();
        };
    }
}

addTaskButton.addEventListener('click', addTask);

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }
}, false);

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error Signing out:', error);
        });
});

showTask();


  

  