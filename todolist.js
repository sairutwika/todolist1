let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = document.getElementById("title").value.trim();
    const priority = document.getElementById("priority").value;
    const deadline = document.getElementById("deadline").value;

    if (!title || !deadline) {
        alert("Please enter title and deadline");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        priority,
        deadline,
        completed: false,
    });
    saveTasks();
    renderTasks();
    document.getElementById("title").value = "";
    document.getElementById("deadline").value = "";
}

function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const statusFilter = document.getElementById("statusFilter").value;
    const priorityFilter = document.getElementById("priorityFilter").value;

    const today = new Date().toISOString().split("T")[0];

    tasks
        .filter((task) => {
            if (statusFilter === "completed" && !task.completed) return false;
            if (statusFilter === "pending" && task.completed) return false;
            if (priorityFilter !== "all" && task.priority !== priorityFilter)
                return false;
            return true;
        })
        .forEach((task) => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task-item" + (task.completed ? " completed" : "");

            const left = document.createElement("div");
            left.className = "task-left";

            const deadline = new Date(task.deadline);
            const todayDate = new Date();
            const dayDiff = Math.ceil(
                (deadline.getTime() - todayDate.getTime()) / (1000 * 3600 * 24)
            );

            let dateLabel = "";
            if (task.completed) {
                dateLabel = "";
            } else if (dayDiff < 0) {
                dateLabel = `<span class="overdue"><i class="fa fa-exclamation-circle"></i> Overdue</span>`;
            } else {
                dateLabel = `<span class="duedays"><i class="fa fa-clock"></i> Due in ${dayDiff} days</span>`;
            }

            left.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})" />
        <span class="task-title">${task.title}</span>
        <span class="priority-label ${task.priority}">${task.priority}</span><br/>
        ${dateLabel}
      `;

            const right = document.createElement("div");
            right.className = "task-actions";
            right.innerHTML = `
        <i class="fa fa-edit"></i>
        <i class="fa fa-trash" onclick="deleteTask(${task.id})"></i>
      `;

            taskDiv.appendChild(left);
            taskDiv.appendChild(right);
            taskList.appendChild(taskDiv);
        });
}

renderTasks();