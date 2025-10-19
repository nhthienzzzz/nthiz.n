// ==================== CYBERPUNK PARTICLES + NETWORK ====================

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Hạt neon bay ---
const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 2,
  dx: (Math.random() - 0.5) * 0.8,
  dy: (Math.random() - 0.5) * 0.8,
  color: Math.random() > 0.5 ? "#ff00ff" : "#00ffff"
}));

// --- Hạt trắng liên kết ---
const networkParticles = Array.from({ length: 60 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  r: Math.random() * 2 + 0.5
}));

// --- Laser bay ---
let lasers = [];
function createLaser() {
  lasers.push({
    x: Math.random() * w,
    y: h,
    length: Math.random() * 100 + 60,
    speed: Math.random() * 6 + 3,
    color: Math.random() > 0.5 ? "#ff00ff" : "#00ffff"
  });
}
setInterval(createLaser, 250);

// --- Vị trí chuột ---
const mouse = { x: -999, y: -999 };
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
  mouse.x = -999;
  mouse.y = -999;
});

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Nền gradient
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#030010");
  bg.addColorStop(1, "#000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // --- Hạt neon ---
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;
  }

  // --- Hạt trắng + liên kết ---
  for (let i = 0; i < networkParticles.length; i++) {
    const p1 = networkParticles[i];
    p1.x += p1.vx;
    p1.y += p1.vy;

    // Va biên
    if (p1.x < 0 || p1.x > w) p1.vx *= -1;
    if (p1.y < 0 || p1.y > h) p1.vy *= -1;

    // Vẽ hạt
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.shadowBlur = 0;
    ctx.fill();

    // Liên kết với các hạt gần
    for (let j = i + 1; j < networkParticles.length; j++) {
      const p2 = networkParticles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        // Kiểm tra gần chuột không
        const dMouse1 = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        const dMouse2 = Math.hypot(p2.x - mouse.x, p2.y - mouse.y);
        const nearMouse = dMouse1 < 120 || dMouse2 < 120;

        ctx.beginPath();
        ctx.strokeStyle = nearMouse
          ? "rgba(255,255,255,0.4)"
          : "rgba(255,255,255,0.15)";
        ctx.lineWidth = nearMouse ? 1.5 : 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  // --- Laser bay ---
  for (let l of lasers) {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x, l.y - l.length);
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = l.color;
    ctx.stroke();
    l.y -= l.speed;
  }
  lasers = lasers.filter(l => l.y + l.length > 0);

  requestAnimationFrame(draw);
}
draw();

// ==================== FPS COUNTER CHUẨN ====================
const fpsEl = document.getElementById('fps');
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function updateFPS() {
  const now = performance.now();
  frameCount++;
  const delta = now - lastTime;
  if (delta >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
    fpsEl.textContent = `FPS: ${fps}`;
  }
  requestAnimationFrame(updateFPS);
}
updateFPS();
