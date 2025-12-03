class Analytics {
    static load() {
        return JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]");
    }

    static save(sessions) {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(sessions));
    }

    static addSession(minutes) {
        const data = this.load();
        data.push({ date: new Date().toISOString(), minutes });
        this.save(data);
    }

    static getStorageKey() {
        const user = localStorage.getItem("currentUser") || "guest";
        return `focusSessions_${user}`;
    }

    static totalMinutes() {
        return this.load().reduce((sum, s) => sum + s.minutes, 0);
    }

    static formatMinutes(total) {
        const hours = Math.floor(total / 60);
        const mins = total % 60;

        if (hours > 0 && mins > 0) return `${hours} hours ${mins} minutes`;
        if (hours > 0) return `${hours} hours`;
        return `${mins} minutes`;
    }

    static totalTasks() {
        if (typeof TaskManager !== "undefined") {
            return TaskManager.load();
        }
        return JSON.parse(localStorage.getItem("tasks") || "[]");
    }


    static completedTasks() {
        return this.totalTasks().filter(t => t.completed).length;
    }

    static completionRate() {
        const tasks = this.totalTasks();
        if (tasks.length === 0) return 0;
        return Math.round((this.completedTasks() / tasks.length) * 100);
    }


    static weeklyTaskStats() {
        const tasks = this.totalTasks();
        const nowMs = Date.now();
        const oneWeekAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;


        const createdThisWeek = tasks.filter(t => {
            const createdTime = typeof t.createdAt === "number" ? t.createdAt : t.id;
            return createdTime && createdTime >= oneWeekAgoMs;
        });

        const createdCount = createdThisWeek.length;


        const completedThisWeek = createdThisWeek.filter(t => {
            return t.completed && typeof t.completedAt === "number" && t.completedAt >= oneWeekAgoMs;
        }).length;


        const incompleteThisWeek = createdThisWeek.filter(t => !t.completed).length;


        const overdueThisWeek = createdThisWeek.filter(t => {
            if (t.completed) return false;
            if (!t.deadline) return false;

            const deadlineTime = new Date(t.deadline).getTime();
            if (isNaN(deadlineTime)) return false;

            return deadlineTime < nowMs;
        }).length;

        return {
            createdCount,
            completedThisWeek,
            incompleteThisWeek,
            overdueThisWeek
        };
    }

    static render() {
        const totalMin = this.totalMinutes();
        const tasks = this.totalTasks();
        const completed = this.completedTasks();
        const rate = this.completionRate();

        const gaugePercent = Math.min(100, Math.round((totalMin / 1440) * 100));

        const weekly = this.weeklyTaskStats();

        document.getElementById("analytics").innerHTML = `
        <h2>Analytics</h2>

        <div class="gauge-container">
            <svg class="gauge" viewBox="0 0 100 100">
                <circle class="bg" cx="50" cy="50" r="45"></circle>
                <circle class="progress" cx="50" cy="50" r="45"
                    style="--percent: ${gaugePercent}">
                </circle>
            </svg>

            <div class="gauge-text">
                <div class="focus-line">${this.formatMinutes(totalMin)} focused</div>
            </div>
        </div>

        <div class="progress-wrapper">
            <div class="progress-label">Task Completion: %${rate}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${rate}%"></div>
            </div>
        </div>
        <p class="task-line">
            ${completed} / ${tasks.length} tasks completed.
        </p>

        <div class="weekly-summary">
            <div class="weekly-summary-title">Weekly task summary (last 7 days)</div>
            <ul class="weekly-summary-list">
                <li><span>Created Tasks</span><span>${weekly.createdCount}</span></li>
                <li><span>Completed Tasks</span><span>${weekly.completedThisWeek}</span></li>
                <li><span>Unfinished Tasks</span><span>${weekly.incompleteThisWeek}</span></li>
                <li><span>Overdue Tasks</span><span>${weekly.overdueThisWeek}</span></li>
            </ul>
        </div>
    `;
    }
}