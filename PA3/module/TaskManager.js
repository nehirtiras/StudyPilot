class TaskManager {

    static getStorageKey() {
        const user = localStorage.getItem("currentUser") || "guest";
        return `tasks_${user}`;
    }

    static load() {
        return JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]");
    }

    static save(tasks) {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(tasks));
    }

    static addTask(title, deadline, type) {
        const tasks = this.load();
        const now = Date.now();

        tasks.push({
            id: now,
            title,
            deadline,
            type,
            completed: false,
            createdAt: now,
            completedAt: null
        });

        this.save(tasks);

        DashboardUI.updateProgress();
        Analytics.render();
    }

    static toggleComplete(id) {
        const tasks = this.load();
        const task = tasks.find(t => t.id === id);

        if (task) {
            const newState = !task.completed;
            task.completed = newState;

            if (newState) {
                task.completedAt = Date.now();
            } else {
                task.completedAt = null;
            }

            this.save(tasks);
        }

        DashboardUI.updateProgress();
        Analytics.render();
    }

    static delete(id) {
        const tasks = this.load().filter(t => t.id !== id);
        this.save(tasks);

        DashboardUI.updateProgress();
        Analytics.render();
    }

    static getTask(id) {
        return this.load().find(t => t.id === id);
    }

    static updateTask(id, newTitle, newDeadline, newType) {
        const tasks = this.load();
        const task = tasks.find(t => t.id === id);

        if (task) {
            task.title = newTitle;
            task.deadline = newDeadline;
            task.type = newType;
            this.save(tasks);
        }

        DashboardUI.updateProgress();
        Analytics.render();
    }
}
