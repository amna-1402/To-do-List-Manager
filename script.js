let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let statusMsg = document.getElementById("statusMsg");
let totalCount = document.getElementById("totalCount");
let completedCount = document.getElementById("completedCount");

let tasks = [];

addBtn.addEventListener("click", addTask);

function addTask() {
  let taskText = taskInput.value.trim();

  if (taskText === "") {
    showStatus("Please enter a task.", false);
    return;
  }

  if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
    showStatus("Task already exists.", false);
    return;
  }

  let taskObj = { text: taskText, completed: false };
  tasks.push(taskObj);
  displayTask(taskObj);
  taskInput.value = "";
  updateCounts();
  showStatus("Task added successfully!", true);
}

function displayTask(taskObj) {
  let li = document.createElement("li");

  let span = document.createElement("span");
  span.textContent = taskObj.text;

  let buttonGroup = document.createElement("span");
  buttonGroup.className = "task-buttons";

  // Done button
  let doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.onclick = () => {
    span.classList.toggle("completed");
    taskObj.completed = !taskObj.completed;
    updateCounts();
  };

  // Highlight button
  let highlightBtn = document.createElement("button");
  highlightBtn.textContent = "Highlight";
  highlightBtn.onclick = () => {
    span.classList.toggle("highlighted");
  };

  // Delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    taskList.removeChild(li);
    tasks = tasks.filter(t => t !== taskObj);
    updateCounts();
    showStatus("Task deleted.", true);
  };

  // Edit button
  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    // Create input field
    let input = document.createElement("input");
    input.type = "text";
    input.value = taskObj.text;
    input.className = "edit-input";

    // Create Save and Cancel buttons
    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";

    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";

    // Hide all buttons during edit
    doneBtn.style.display = "none";
    deleteBtn.style.display = "none";
    highlightBtn.style.display = "none";
    editBtn.style.display = "none";

    // Save logic
    saveBtn.onclick = () => {
      let newText = input.value.trim();
      if (newText === "") {
        showStatus("Task cannot be empty.", false);
        return;
      }
      if (!tasks.some(task => task.text.toLowerCase() === newText.toLowerCase() && task !== taskObj)) {
        taskObj.text = newText;
        span.textContent = newText;
        li.replaceChild(span, input);
        buttonGroup.replaceChild(editBtn, saveBtn);
        buttonGroup.removeChild(cancelBtn);
        showStatus("Task updated successfully!", true);
      } else {
        showStatus("Task with the same name already exists.", false);
      }

      // Show original buttons again
      doneBtn.style.display = "";
      deleteBtn.style.display = "";
      highlightBtn.style.display = "";
      editBtn.style.display = "";
    };

    // Cancel logic
    cancelBtn.onclick = () => {
      li.replaceChild(span, input);
      buttonGroup.replaceChild(editBtn, saveBtn);
      buttonGroup.removeChild(cancelBtn);

      doneBtn.style.display = "";
      deleteBtn.style.display = "";
      highlightBtn.style.display = "";
      editBtn.style.display = "";

      showStatus("Edit cancelled.", false);
    };

    li.replaceChild(input, span);
    buttonGroup.replaceChild(saveBtn, editBtn);
    buttonGroup.appendChild(cancelBtn);
  };

  buttonGroup.append(doneBtn, editBtn, deleteBtn, highlightBtn);
  li.append(span, buttonGroup);
  taskList.appendChild(li);
}

function updateCounts() {
  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(t => t.completed).length;
}

function showStatus(message, success) {
  statusMsg.textContent = message;
  statusMsg.style.color = success ? "#ffae42" : "red";
}
