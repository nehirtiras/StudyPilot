class Prioritizer {
    static sortTasks(tasks) {
        return tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
}
