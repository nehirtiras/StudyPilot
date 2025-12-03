class TimerUI {
    static render() {
        document.getElementById("pomodoro").innerHTML = `
            <h2>Pomodoro</h2>
            <div class="timer-wrapper" id="timer">25:00</div>
            <button onclick="Pomodoro.start()">Start</button>
            <button onclick="Pomodoro.pause()">Pause</button>
            <button onclick="Pomodoro.reset()">Reset</button>
        `;
    }

    static update(seconds) {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        document.getElementById("timer").innerText = `${m}:${s}`;
    }
}
