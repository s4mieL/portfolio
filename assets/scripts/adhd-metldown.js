// === Inject Canvas ===
const canvas = document.createElement('canvas');
canvas.id = 'partyCanvas';
canvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
`;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const COLORS = [
  '#ff0080', '#ff6600', '#ffff00', '#00ff88',
  '#00ccff', '#aa00ff', '#ff00cc', '#ffffff',
  '#ff4444', '#44ffdd'
];

const SHAPES = ['rect', 'circle', 'ribbon'];

class Confetto {
  constructor() {
    this.reset(true);
  }

  reset(fromTop = false) {
    this.x = Math.random() * canvas.width;
    this.y = fromTop ? -20 : Math.random() * canvas.height;
    this.size = Math.random() * 10 + 5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.speedY = Math.random() * 3 + 1.5;
    this.speedX = (Math.random() - 0.5) * 2.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.08 + 0.02;
    this.scaleY = 1;
    this.scaleDir = (Math.random() > 0.5 ? 1 : -1) * 0.05;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 1.2;
    this.wobble += this.wobbleSpeed;
    this.rotation += this.rotationSpeed;
    this.scaleY += this.scaleDir;
    if (this.scaleY > 1 || this.scaleY < 0.1) this.scaleDir *= -1;

    if (this.y > canvas.height + 30) this.reset(true);
    if (this.x < -30) this.x = canvas.width + 10;
    if (this.x > canvas.width + 30) this.x = -10;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(1, this.scaleY);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.5);
    } else if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'ribbon') {
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size, this.size / 2, this.size, this.size, 0);
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }

    ctx.restore();
  }
}

const confetti = Array.from({ length: 180 }, () => new Confetto());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    c.update();
    c.draw();
  });
  requestAnimationFrame(animate);
}

const JUMPSCARE_MESSAGES = [
  "HOI HOI HOI!!!",
  "TEM APPEAR!!!",
  "SUPRIZE HUMANN!!!",
  "U NOT EXPECT TEM!!!",
  "TEM SEE U!!! 👁️",
  "HOI!!! U SCROL!!!",
  "TEM POP OUT!!!",
  "U BLINK!! TEM WIN!!!",
  "DUN PANIK!!! TEM FREN!!!",
  "HEHEHE TEM HERE!!!",
  "TEM JUMPSCAR!!!",
  "U FOUND TEM!!!",
  "TEM CHAOS MODE!!!",
  "HOI!!! LOOK TEM!!!",
  "TEM TOO FAST 4 U!!!"
];

function triggerJumpscare() {

  const msg = JUMPSCARE_MESSAGES[Math.floor(Math.random() * JUMPSCARE_MESSAGES.length)];

  const el = document.createElement('div');
  el.innerText = msg;
  el.style.cssText = `
    position: fixed;
    z-index: 99999;
    pointer-events: none;
    font-size: ${Math.random() * 80 + 60}px;
    font-weight: 900;
    font-family: Impact, sans-serif;
    color: white;
    text-shadow:
      0 0 20px #ff00ff,
      0 0 40px #ff00ff,
      4px 4px 0 #000;
    top: ${Math.random() * 70 + 10}%;
    left: ${Math.random() * 60 + 10}%;
    transform: translate(-50%, -50%) scale(0) rotate(${Math.random() * 30 - 15}deg);
    transition: transform 0.08s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    white-space: nowrap;
  `;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -50%) scale(1) rotate(${Math.random() * 30 - 15}deg)`;
    });
  });

  let shakes = 0;
  const shakeInterval = setInterval(() => {
    el.style.marginLeft = `${(Math.random() - 0.5) * 16}px`;
    el.style.marginTop = `${(Math.random() - 0.5) * 16}px`;
    shakes++;
    if (shakes > 6) clearInterval(shakeInterval);
  }, 50);

  const stayDuration = Math.random() * 600 + 600;
  setTimeout(() => {
    el.style.transition = 'transform 0.15s ease-in, opacity 0.15s ease-in';
    el.style.transform = `translate(-50%, -50%) scale(2) rotate(${Math.random() * 40 - 20}deg)`;
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 200);
  }, stayDuration);

  const nextDelay = Math.random() * 4000 + 2000;
  setTimeout(triggerJumpscare, nextDelay);
}

// Start the first one after 2 seconds
setTimeout(triggerJumpscare, 2000);

animate();