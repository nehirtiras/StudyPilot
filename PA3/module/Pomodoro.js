class Pomodoro {
    static totalRunMs = 0;
    static lastTick = null;
    static interval = null;

    static phase = "work";
    static workDurationMs = 25 * 60 * 1000;
    static shortBreakDurationMs = 5 * 60 * 1000;
    static longBreakDurationMs = 15 * 60 * 1000;
    static completedWorkSessions = 0;

    static duration = Pomodoro.workDurationMs;

    static start() {
        if (this.interval) return;
        this.lastTick = Date.now();

        this.interval = setInterval(() => {
            const now = Date.now();
            this.totalRunMs += (now - this.lastTick);
            this.lastTick = now;

            const remaining = this.duration - this.totalRunMs;
            TimerUI.update(Math.max(0, Math.ceil(remaining / 1000)));

            if (remaining <= 0) {
                clearInterval(this.interval);
                this.interval = null;

                if (this.phase === "work") {
                    const minutes = Math.round(this.totalRunMs / 60000);

                    Analytics.addSession(minutes);
                    Analytics.render();

                    this.completedWorkSessions++;

                    alert(`Focus session completed! (${minutes} minute)\nBreak time is starting.`);

                    this.phase = "break";

                    if (this.completedWorkSessions % 4 === 0) {
                        this.duration = this.longBreakDurationMs;
                    } else {
                        this.duration = this.shortBreakDurationMs;
                    }

                    this.totalRunMs = 0;
                    this.lastTick = null;
                    TimerUI.update(this.duration / 1000);

                    this.start();
                }
                else {
                    alert("Break finished! Ready for the next focus session.");

                    this.phase = "work";
                    this.duration = this.workDurationMs;
                    this.totalRunMs = 0;
                    this.lastTick = null;

                    TimerUI.update(this.duration / 1000);
                }
            }
        }, 1000);
    }

    static pause() {
        if (!this.interval) return;

        clearInterval(this.interval);
        this.interval = null;
    }

    static reset() {
        this.pause();
        this.totalRunMs = 0;
        this.lastTick = null;
        this.phase = "work";
        this.duration = this.workDurationMs;
        TimerUI.update(this.duration / 1000);
    }

    static changeDuration(minutes) {
        const ms = Number(minutes) * 60 * 1000;
        if (!ms || ms <= 0) return;

        this.workDurationMs = ms;

        if (this.phase === "work" && !this.interval) {
            this.duration = ms;
            this.totalRunMs = 0;
            this.lastTick = null;
            TimerUI.update(this.duration / 1000);
        }
    }
}
