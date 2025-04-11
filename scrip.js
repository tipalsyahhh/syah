const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sun = document.getElementById("sunAnimation");
const toggleBtn = document.getElementById("modeToggle");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fireworks = [], launchers = [];
const fireNumber = 30, range = 30;

function randColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

function makeFullCircleFirework(x, y) {
  const color = randColor();
  const velocity = Math.random() * 8 + 8;
  const max = fireNumber * 3;
  for (let i = 0; i < max; i++) {
    const rad = (i * Math.PI * 2) / max;
    fireworks.push({
      x, y,
      size: Math.random() * 2 + 1.5,
      fill: color,
      vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
      vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 2,
      z: 0,
      alpha: 1,
      ay: 0.06,
      life: Math.round((Math.random() * range) / 2 + range / 1.5)
    });
  }
}

function launchFirework() {
  const count = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * canvas.height / 2 + 100;
    launchers.push({ x, y, vy: -Math.random() * 3 - 4, targetY, color: randColor(), trail: [] });
  }
}

function project3D(x, y, z) {
  const scale = 300 / (300 + z);
  return {
    x: canvas.width / 2 + (x - canvas.width / 2) * scale,
    y: canvas.height / 2 + (y - canvas.height / 2) * scale,
    size: scale
  };
}

function animate() {
  if (!isNightMode) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = launchers.length - 1; i >= 0; i--) {
    const l = launchers[i];
    l.y += l.vy;
    l.trail.push({ x: l.x, y: l.y });
    if (l.trail.length > 8) l.trail.shift();

    for (let j = 0; j < l.trail.length; j++) {
      const t = l.trail[j];
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${j / l.trail.length})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = l.color;
    ctx.fill();

    if (l.y <= l.targetY) {
      makeFullCircleFirework(l.x, l.y);
      launchers.splice(i, 1);
    }
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    f.vy += f.ay;
    f.x += f.vx;
    f.y += f.vy;
    f.z += f.vz;
    f.alpha -= 1 / f.life;

    const p = project3D(f.x, f.y, f.z);
    const size = Math.max(0, f.size * p.size);
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = f.fill.replace("rgb", "rgba").replace(")", `,${f.alpha})`);
    ctx.fill();

    if (f.alpha <= 0 || size <= 0) fireworks.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

let fireInterval = null;
let isNightMode = true;

function startFireworks() {
  canvas.style.display = "block";
  fireInterval = setInterval(launchFirework, 1000);
  animate();
}

function stopFireworks() {
  canvas.style.display = "none";
  clearInterval(fireInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateTextColor() {
  const content = document.querySelector(".content");
  const color = isNightMode ? "white" : "black";
  content.style.color = color;

  const links = content.querySelectorAll("a");
  links.forEach(link => {
    link.style.color = color;
    link.style.borderColor = color;
  });
}

function applyNightMode() {
  document.body.style.background = "black";
  sun.style.display = "none";
  canvas.style.display = "block";
  toggleBtn.textContent = "Daytime Mode ☀️";
  isNightMode = true;
  updateTextColor();
  startFireworks();
}

function applyDayMode() {
  document.body.style.background = "white";
  sun.style.display = "block";
  canvas.style.display = "none";
  toggleBtn.textContent = "🌙  Night Mode";
  isNightMode = false;
  updateTextColor();
  stopFireworks();
}


toggleBtn.addEventListener("click", () => {
  isNightMode = !isNightMode;

  if (isNightMode) {
    document.body.style.background = "black";
    document.getElementById("sunAnimation").style.display = "none";
    disableVanta();
    toggleBtn.textContent = "Mode Siang ☀️";
    startFireworks && startFireworks();
  } else {
    document.body.style.background = "white";
    document.getElementById("sunAnimation").style.display = "block";
    enableVanta();
    toggleBtn.textContent = "Mode Malam 🌙";
    stopFireworks && stopFireworks();
  }

  updateTextColor && updateTextColor();
});

applyNightMode();
