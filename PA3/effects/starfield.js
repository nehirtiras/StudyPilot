const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const stars = [];
const STAR_COUNT = 200;

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        delta: Math.random() * 0.015 + 0.005
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
        s.alpha += s.delta;
        if (s.alpha >= 1 || s.alpha <= 0.2) s.delta *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "white";
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();
