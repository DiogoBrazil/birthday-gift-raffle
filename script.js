const gifts = [
  "Caneta para tablet",
  "Bobbie goods dia para noite",
  "Bobbie goods dias quentes",
  "cante branca",
  "Coturno preto feminino com brilho no shopping ",
  "Aw coins 1250 R$ 27,90",
  "Aw coins 1900 R$ 41,90",
  "Bebê reborn (menino)",
];

const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const drawnList = document.getElementById("drawnList");
const drawnEmpty = document.getElementById("drawnEmpty");
const spinsInfo = document.getElementById("spinsInfo");

const MAX_SPINS = 3;
let spinsUsed = 0;
let drawnGifts = [];

/* ── Confetti setup ── */
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiAnimating = false;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

const colors = [
  "#ff8cc8",
  "#ffd86b",
  "#8fd9ff",
  "#b59cff",
  "#9ff0c9",
  "#ffb17a",
  "#ff9e9e",
  "#9ad0ff",
  "#e0b3ff",
  "#ffe08a"
];

let currentRotation = 0;
let isSpinning = false;

function drawWheel(rotation = 0) {
  const size = wheelCanvas.width;
  const center = size / 2;
  const radius = center - 10;
  const arc = (Math.PI * 2) / gifts.length;

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  for (let i = 0; i < gifts.length; i++) {
    const startAngle = i * arc;
    const endAngle = startAngle + arc;

    // fatia
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // texto
    ctx.save();
    ctx.rotate(startAngle + arc / 2);

    ctx.textAlign = "right";
    ctx.fillStyle = "#3d1f52";
    ctx.font = "bold 17px Poppins, Arial, sans-serif";

    const label = gifts[i];
    const maxWidth = radius * 0.58;

    wrapText(ctx, label, radius - 28, 0, maxWidth, 19);

    ctx.restore();
  }

  // círculo central
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ff6fb5";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  const centerGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
  centerGrad.addColorStop(0, "#ffe066");
  centerGrad.addColorStop(1, "#ffb84d");
  ctx.fillStyle = centerGrad;
  ctx.fill();

  ctx.restore();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }

  lines.push(line.trim());

  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = y - totalHeight / 2;

  lines.forEach((lineText, index) => {
    context.fillText(lineText, x, startY + index * lineHeight);
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Confetti explosion ── */
function launchConfetti() {
  const confettiColors = [
    "#ff6fb5", "#9b6bff", "#ffd95c", "#8fd9ff",
    "#9ff7d1", "#ffb17a", "#ff9e9e", "#e0b3ff"
  ];

  confettiPieces = [];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
      y: confettiCanvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1) * 18 - 4,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      gravity: 0.12 + Math.random() * 0.08,
      opacity: 1,
      decay: 0.003 + Math.random() * 0.004
    });
  }

  if (!confettiAnimating) {
    confettiAnimating = true;
    animateConfetti();
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let alive = false;
  for (const p of confettiPieces) {
    if (p.opacity <= 0) continue;
    alive = true;

    p.x += p.vx;
    p.vy += p.gravity;
    p.y += p.vy;
    p.vx *= 0.99;
    p.rotation += p.rotSpeed;
    p.opacity -= p.decay;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation);
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }

  if (alive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

function getSegmentAtPointer(rotation) {
  // O ponteiro está no topo da roleta = ângulo 3π/2 em coordenadas canvas
  // ctx.rotate(rotation) faz o segmento i aparecer na tela no ângulo: rotation + i*arc até rotation + (i+1)*arc
  // Para saber qual segmento está no topo: α = (3π/2 - rotation) mod 2π → index = floor(α / arc)
  const arc = (Math.PI * 2) / gifts.length;
  const angle = normalizeAngle((Math.PI * 3 / 2) - rotation);
  return Math.floor(angle / arc);
}

function spinWheel() {
  if (isSpinning || spinsUsed >= MAX_SPINS) return;

  isSpinning = true;
  spinBtn.disabled = true;

  // Gira aleatoriamente (5-7 voltas completas + posição aleatória)
  const extraSpins = Math.PI * 2 * (5 + Math.random() * 3);
  const randomOffset = Math.random() * Math.PI * 2;
  const finalRotation = currentRotation + extraSpins + randomOffset;

  const duration = 5000;
  const startTime = performance.now();
  const startRotation = currentRotation;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    currentRotation = startRotation + (finalRotation - startRotation) * eased;
    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentRotation = finalRotation % (Math.PI * 2);
      drawWheel(currentRotation);

      // Detecta qual segmento parou sob o ponteiro
      const selectedIndex = getSegmentAtPointer(currentRotation);
      const gift = gifts[selectedIndex];

      // Se já foi sorteado, gira de novo sem gastar tentativa
      if (drawnGifts.includes(gift)) {
        isSpinning = false;
        spinWheel();
        return;
      }

      spinsUsed++;
      drawnGifts.push(gift);
      addDrawnGift(gift, spinsUsed);
      launchConfetti();

      const remaining = MAX_SPINS - spinsUsed;
      if (remaining > 0) {
        spinBtn.textContent = `Girar roleta (${remaining} restante${remaining > 1 ? 's' : ''})`;
        spinBtn.disabled = false;
        spinsInfo.textContent = `Sorteio ${spinsUsed} de ${MAX_SPINS} realizado!`;
      } else {
        spinBtn.textContent = "Sorteios encerrados!";
        spinBtn.disabled = true;
        spinsInfo.textContent = `Todos os ${MAX_SPINS} sorteios foram realizados!`;
        showDoneMessage();
      }

      isSpinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function addDrawnGift(gift, number) {
  drawnEmpty.style.display = "none";

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="drawn-number">${number}º</span>
    <div class="drawn-info">
      <span class="drawn-tag">${number}º sorteio</span>
      <span class="drawn-name">${gift}</span>
    </div>
  `;
  drawnList.appendChild(li);
}

function showDoneMessage() {
  const panel = document.querySelector(".drawn-panel");
  const div = document.createElement("div");
  div.className = "done-message";
  div.innerHTML = `
    <span class="done-emoji">🎉</span>
    <p>Parabéns Ana Bella!<br>Esses são seus presentes!</p>
  `;
  panel.appendChild(div);
}

function normalizeAngle(angle) {
  while (angle < 0) angle += Math.PI * 2;
  while (angle >= Math.PI * 2) angle -= Math.PI * 2;
  return angle;
}

spinBtn.addEventListener("click", spinWheel);

drawWheel();