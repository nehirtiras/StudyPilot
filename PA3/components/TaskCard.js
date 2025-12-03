class TaskCard {

    static currentEditId = null;

    static renderAllInDashboard() {
        const list = document.getElementById("taskList");
        const tasks = Prioritizer.sortTasks(TaskManager.load());
        list.innerHTML = "";

        tasks.forEach(t => {
            list.innerHTML += `
                <div class="task-card">

                    <div class="task-info">
                        <h3>${t.title}</h3>
                        <p class="task-meta">Deadline: ${t.deadline}</p>
                        <p class="task-meta">Type: ${t.type}</p>

                        <div class="toggle-row">
                            <input type="checkbox" id="toggle-${t.id}" class="toggle-checkbox"
                                onchange="TaskManager.toggleComplete(${t.id}); TaskCard.renderAllInDashboard(); DashboardUI.updateProgress();"
                                ${t.completed ? "checked" : ""}>

                            <label for="toggle-${t.id}" class="toggle-label"></label>
                            <span class="toggle-text">Completed</span>
                        </div>
                    </div>

                    <div class="task-actions">
                        <button class="edit-btn" onclick="TaskCard.editTask(${t.id})">Edit</button>
                        <button class="delete-btn" onclick="TaskManager.delete(${t.id}); TaskCard.renderAllInDashboard(); DashboardUI.updateProgress();">
                            Delete
                        </button>
                    </div>

                </div>
            `;
        });
    }

    static showAddForm() {
        TaskCard.currentEditId = null;
        document.getElementById("modalTaskTitle").value = "";
        document.getElementById("modalTaskDeadline").value = "";
        document.getElementById("modalTaskType").value = "Course";
        document.getElementById("taskModal").style.display = "flex";
    }

    static submitTask() {
        const title = document.getElementById("modalTaskTitle").value;
        const deadline = document.getElementById("modalTaskDeadline").value;
        const type = document.getElementById("modalTaskType").value;

        if (!title || !deadline || !type) return;

        if (TaskCard.currentEditId !== null) {
            TaskManager.updateTask(TaskCard.currentEditId, title, deadline, type);
            TaskCard.currentEditId = null;
        } else {
            TaskManager.addTask(title, deadline, type);
        }

        TaskCard.renderAllInDashboard();
        DashboardUI.updateProgress();
        TaskCard.closeModal();
    }

    static editTask(id) {
        const task = TaskManager.getTask(id);
        if (!task) return;

        TaskCard.currentEditId = id;

        document.getElementById("modalTaskTitle").value = task.title;
        document.getElementById("modalTaskDeadline").value = task.deadline;
        document.getElementById("modalTaskType").value = task.type;

        document.getElementById("taskModal").style.display = "flex";
    }

    static closeModal() {
        TaskCard.currentEditId = null;
        document.getElementById("taskModal").style.display = "none";
    }
}
