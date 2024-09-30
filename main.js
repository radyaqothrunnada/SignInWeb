const aktivitas = document.getElementById('aktivitas');
const waktu = document.getElementById('waktu');
const Password = document.getElementById('Password');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (aktivitas.value === '' || waktu.value === '' || Password.value.length < 8) {
        alert("aktivitas, waktu, atau Password tidak valid");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `${aktivitas.value} - ${waktu.value}`;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        aktivitas.value = "";
        waktu.value = "";
        Password.value = "";
        saveData();
    }
}


listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();
