var taskList=document.getElementById("taskList");
var newTaskInput=document.getElementById("newTask");
var addTaskButton=document.getElementById("addTask");
var toggleModeButton=document.getElementById("toggleMode");
var validationMessage=document.getElementById("validationMessage");
var tasks=JSON.parse(localStorage.getItem("tasks"))||[];
var isDarkMode=JSON.parse(localStorage.getItem("isDarkMode"))||false;

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(function (taskObj, index) {
    var taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = '<div class="task-content"><span>' + taskObj.text + '</span><br><small>' + taskObj.timestamp + '</small></div><div class="task-buttons"><button class="editBtn" data-index="' + index + '">Edit</button><button class="deleteBtn" data-index="' + index + '">Delete</button></div><button class="updateBtn" style="display: none;" data-index="' + index + '">Update</button>';
    taskList.appendChild(taskItem);
  });
}

function getFormattedDateTime(){
  var now=new Date();
  var options={year:"numeric",month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"};
  return now.toLocaleString(undefined,options);
}

function toggleMode(){
  document.body.classList.toggle("dark-mode",isDarkMode);
  document.body.classList.toggle("light-mode",!isDarkMode);
  toggleModeButton.classList.toggle("dark-mode",isDarkMode);
  toggleModeButton.classList.toggle("light-mode",!isDarkMode);
  toggleModeButton.textContent=isDarkMode?"🌞":"🌙";
  localStorage.setItem("isDarkMode",JSON.stringify(isDarkMode));
}

addTaskButton.addEventListener("click",function(){
  var taskText=newTaskInput.value.trim();
  if(taskText===""){
    validationMessage.textContent="Please write something!!";
    validationMessage.style.color="red";
    setTimeout(function() {
      validationMessage.textContent="";
    },5000);
    return;
  }

  var taskObj={
    text:taskText,
    timestamp:getFormattedDateTime()
  };

  tasks.unshift(taskObj);
  localStorage.setItem("tasks",JSON.stringify(tasks));
  renderTasks();
  newTaskInput.value="";
});

taskList.addEventListener("click",function(e){
  if(e.target.classList.contains("editBtn")) {
    var taskItem=e.target.closest(".task-item");
    var span=taskItem.querySelector(".task-content span");
    var index=e.target.dataset.index;
    span.contentEditable=true;
    span.focus();
    var editButton=taskItem.querySelector(".editBtn");
    var deleteButton=taskItem.querySelector(".deleteBtn");
    var updateButton=taskItem.querySelector(".updateBtn");
    editButton.style.display="none";
    deleteButton.style.display="none";
    updateButton.style.display="inline-block";
  } else if(e.target.classList.contains("updateBtn")) {
    var taskItem=e.target.closest(".task-item");
    var span=taskItem.querySelector(".task-content span");
    var index=e.target.dataset.index;
    tasks[index].text=span.textContent;
    tasks[index].timestamp=getFormattedDateTime();
    localStorage.setItem("tasks",JSON.stringify(tasks));
    renderTasks();
  } else if(e.target.classList.contains("deleteBtn")) {
    var index=e.target.dataset.index;
    var isConfirmed=confirm("Are you sure you want to delete this task?");
    if (isConfirmed){
      tasks.splice(index,1);
      localStorage.setItem("tasks",JSON.stringify(tasks));
      renderTasks();
    }
  }
});

toggleModeButton.addEventListener("click",function(){
  isDarkMode=!isDarkMode;
  toggleMode();
});

renderTasks();
toggleMode();
