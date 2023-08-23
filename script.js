const taskList = document.getElementById("taskList");
const newTaskInput = document.getElementById("newTask");
const addTaskButton = document.getElementById("addTask");
const toggleModeButton = document.getElementById("toggleMode");
const validationMessage = document.getElementById("validationMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")) || false;

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((taskObj, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
      <div class="task-content">
        <span>${taskObj.text}</span>
        <small>${taskObj.timestamp}</small>
      </div>
      <div class="task-buttons">
        <button class="editBtn" data-index="${index}">Edit</button>
        <button class="deleteBtn" data-index="${index}">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function getFormattedDateTime() {
  const now = new Date();
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return now.toLocaleString(undefined, options);
}

function toggleMode() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
  toggleModeButton.classList.toggle("dark-mode", isDarkMode);
  toggleModeButton.classList.toggle("light-mode", !isDarkMode);
  toggleModeButton.textContent = isDarkMode ? "🌞" : "🌙";
  localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
}

addTaskButton.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText === "") {
    validationMessage.textContent = "Please write something!!";
    validationMessage.style.color = "red";
    setTimeout(() => {
      validationMessage.textContent = "";
    }, 5000);
    return; 
  }

  const taskObj = {
    text: taskText,
    timestamp: getFormattedDateTime()
  };

  tasks.unshift(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  newTaskInput.value = "";
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("editBtn")) {
    const taskItem = e.target.closest(".task-item");
    const span = taskItem.querySelector(".task-content span");
    const index = e.target.dataset.index;

    span.contentEditable = true;
    span.focus();

    const editButton = taskItem.querySelector(".editBtn");
    const deleteButton = taskItem.querySelector(".deleteBtn");
    editButton.style.display = "none";
    deleteButton.style.display = "none";

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.className = "updateBtn";

    updateButton.addEventListener("click", () => {
      tasks[index].text = span.textContent;
      tasks[index].timestamp = getFormattedDateTime();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      span.contentEditable = false;
      taskItem.removeChild(updateButton);
      editButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
    });

    taskItem.appendChild(updateButton);
  } else if (e.target.classList.contains("deleteBtn")) {
    const index = e.target.dataset.index;
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

toggleModeButton.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  toggleMode();
});

renderTasks();
toggleMode();
