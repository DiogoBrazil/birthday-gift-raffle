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
const resultText = document.getElementById("resultText");
const giftList = document.getElementById("giftList");

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

function renderGiftList() {
  giftList.innerHTML = "";
  gifts.forEach((gift, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${index + 1}</span>${gift}`;
    giftList.appendChild(li);
  });
}

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
    ctx.fillStyle = "#5a3b68";
    ctx.font = "bold 20px Arial";

    const label = gifts[i];
    const maxWidth = radius * 0.62;

    wrapText(ctx, label, radius - 24, 0, maxWidth, 22);

    ctx.restore();
  }

  // círculo central
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#ff6fb5";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd95c";
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

function spinWheel() {
  if (isSpinning) return;

  isSpinning = true;
  spinBtn.disabled = true;
  resultText.textContent = "Girando...";
  
  const selectedIndex = Math.floor(Math.random() * gifts.length);
  const segmentAngle = (Math.PI * 2) / gifts.length;

  // Queremos que o centro do segmento sorteado pare no topo (ponteiro)
  const targetAngle =
    (Math.PI * 2) - (selectedIndex * segmentAngle + segmentAngle / 2);

  const extraSpins = Math.PI * 2 * (5 + Math.random() * 2);
  const finalRotation = currentRotation + extraSpins + normalizeAngle(targetAngle - (currentRotation % (Math.PI * 2)));

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

      resultText.textContent = `${selectedIndex + 1} - ${gifts[selectedIndex]} 🎁`;
      isSpinning = false;
      spinBtn.disabled = false;
    }
  }

  requestAnimationFrame(animate);
}

function normalizeAngle(angle) {
  while (angle < 0) angle += Math.PI * 2;
  while (angle >= Math.PI * 2) angle -= Math.PI * 2;
  return angle;
}

spinBtn.addEventListener("click", spinWheel);

renderGiftList();
drawWheel();