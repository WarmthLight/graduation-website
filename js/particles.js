/* ===== Particles & Canvas Effects ===== */
/* Global utility: sleep */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ===== Canvas Animation Base Class ===== */
class CanvasAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animating = false;
    this.animationId = null;
    this.dpr = window.devicePixelRatio || 1;
    this.isMobile = window.innerWidth < 768 || (matchMedia && matchMedia('(pointer: coarse)').matches);
  }

  resize() {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  init() {
    this.resize();
  }

  draw() {}

  animate() {
    this.animating = true;
    this.draw();
    this.animationId = requestAnimationFrame(() => {
      if (this.animating) this.animate();
    });
  }

  stop() {
    this.animating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    this.ctx = null;
    this.canvas = null;
  }
}

/* ===== Code Rain ===== */
class CodeRain extends CanvasAnimation {
  constructor(canvas) {
    super(canvas);
    this.fontSize = 14;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.drops = [];
    this.init();
  }

  init() {
    super.init();
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }

  resize() {
    super.resize();
    this.columns = Math.floor(window.innerWidth / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
  }

  draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.fillStyle = 'rgba(12, 12, 20, 0.05)';
    this.ctx.fillRect(0, 0, w, h);
    this.ctx.fillStyle = 'rgba(212, 168, 83, 0.6)';
    this.ctx.font = this.fontSize + 'px monospace';
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
      if (this.drops[i] * this.fontSize > h && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }
}

/* ===== Meteor Shower ===== */
class MeteorShower extends CanvasAnimation {
  constructor(canvas) {
    super(canvas);
    this.meteors = [];
    this.gears = [];
    this.codes = [];
    this.pixels = [];
    this.codeChars = ['for', 'while', 'if', 'class', 'function', 'return'];
    this.init();
  }

  init() {
    super.init();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.meteors = [];
    this.gears = [];
    this.codes = [];
    this.pixels = [];

    const meteorCount = this.isMobile ? 12 : 25;
    const gearCount = this.isMobile ? 4 : 8;
    const codeCount = this.isMobile ? 5 : 10;
    const pixelCount = this.isMobile ? 8 : 15;

    for (let i = 0; i < meteorCount; i++) {
      this.meteors.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        length: Math.random() * 50 + 15,
        speed: Math.random() * 5 + 2
      });
    }
    for (let i = 0; i < gearCount; i++) {
      this.gears.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        size: Math.random() * 20 + 12,
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06
      });
    }
    for (let i = 0; i < codeCount; i++) {
      this.codes.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        text: this.codeChars[Math.floor(Math.random() * this.codeChars.length)],
        speed: Math.random() * 2.5 + 1
      });
    }
    for (let i = 0; i < pixelCount; i++) {
      this.pixels.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 4 + 2,
        color: ['#d4a853', '#c9787e', '#8b7ec8', '#6ba3be'][Math.floor(Math.random() * 4)]
      });
    }
  }

  update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.meteors.forEach(m => {
      m.y += m.speed;
      if (m.y > h) { m.y = -m.length; m.x = Math.random() * w; }
    });
    this.gears.forEach(g => {
      g.y += g.speed;
      g.rotation += g.rotationSpeed;
      if (g.y > h + g.size) { g.y = -g.size; g.x = Math.random() * w; }
    });
    this.codes.forEach(c => {
      c.y += c.speed;
      if (c.y > h) { c.y = -20; c.x = Math.random() * w; }
    });
    this.pixels.forEach(p => {
      p.y += p.speed;
      p.x += (Math.random() - 0.5) * 1;
      if (p.y > h) { p.y = -p.size; p.x = Math.random() * w; }
    });
  }

  draw() {
    this.update();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.fillStyle = 'rgba(12, 12, 20, 0.15)';
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.strokeStyle = 'rgba(212, 168, 83, 0.5)';
    this.ctx.lineWidth = 1.5;
    this.meteors.forEach(m => {
      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(m.x, m.y + m.length);
      this.ctx.stroke();
    });

    this.ctx.strokeStyle = 'rgba(201, 120, 126, 0.5)';
    this.ctx.lineWidth = 2;
    this.gears.forEach(g => {
      this.ctx.save();
      this.ctx.translate(g.x, g.y);
      this.ctx.rotate(g.rotation);
      this.ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a1 = (i / 8) * Math.PI * 2;
        const a2 = ((i + 0.5) / 8) * Math.PI * 2;
        this.ctx.lineTo(Math.cos(a1) * g.size, Math.sin(a1) * g.size);
        this.ctx.lineTo(Math.cos(a2) * g.size * 0.7, Math.sin(a2) * g.size * 0.7);
      }
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.restore();
    });

    this.ctx.fillStyle = 'rgba(139, 126, 200, 0.5)';
    this.ctx.font = '12px monospace';
    this.codes.forEach(c => {
      this.ctx.fillText(c.text, c.x, c.y);
    });

    this.pixels.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.ctx.globalAlpha = 1;
  }
}

/* ===== Gallery Background ===== */
class GalleryBackground extends CanvasAnimation {
  constructor(canvas) {
    super(canvas);
    this.particles = [];
    this.init();
  }

  init() {
    super.init();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.particles = [];
    const colors = ['#d4a853', '#c9787e', '#8b7ec8', '#6ba3be', '#6bc9a8'];
    const count = this.isMobile ? 25 : 50;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    });
  }

  draw() {
    this.update();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);
    this.particles.forEach(p => {
      const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
      this.ctx.globalAlpha = pulseOpacity;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }
}

/* ===== Starry Sky ===== */
class StarrySky extends CanvasAnimation {
  constructor(canvas) {
    super(canvas);
    this.stars = [];
    this.hearts = [];
    this.init();
  }

  init() {
    super.init();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.stars = [];
    const starCount = this.isMobile ? 40 : 80;
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random(),
        speed: Math.random() * 0.01 + 0.003
      });
    }
    this.hearts = [];
    this.spawnHearts();
  }

  spawnHearts() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const colors = ['#d4a853', '#c9787e', '#8b7ec8', '#6ba3be', '#6bc9a8', '#d4a0b5'];
    const heartCount = this.isMobile ? 5 : 10;
    for (let i = 0; i < heartCount; i++) {
      this.hearts.push({
        x: Math.random() * w,
        y: h + Math.random() * 100,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(Math.random() * 0.6 + 0.2),
        opacity: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  drawHeart(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + size * 0.3);
    this.ctx.bezierCurveTo(x - size * 0.5, y - size * 0.3, x - size, y + size * 0.1, x, y + size);
    this.ctx.bezierCurveTo(x + size, y + size * 0.1, x + size * 0.5, y - size * 0.3, x, y + size * 0.3);
    this.ctx.closePath();
  }

  update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.stars.forEach(s => {
      s.opacity += s.speed;
      if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
    });
    this.hearts.forEach(heart => {
      heart.x += heart.speedX;
      heart.y += heart.speedY;
      if (heart.y < -heart.size * 3) {
        heart.y = h + heart.size;
        heart.x = Math.random() * w;
      }
      if (heart.x < -heart.size * 2) heart.x = w + heart.size;
      if (heart.x > w + heart.size * 2) heart.x = -heart.size;
    });
  }

  draw() {
    this.update();
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);
    this.stars.forEach(s => {
      this.ctx.globalAlpha = s.opacity;
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.hearts.forEach(h => {
      this.ctx.globalAlpha = h.opacity;
      this.ctx.fillStyle = h.color;
      this.drawHeart(h.x, h.y, h.size);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }
}

/* ===== Pixel Explosion (with optional sound + throttle) ===== */
let _lastExplosionTime = 0;
function createPixelExplosion(x, y, playSound) {
  const now = Date.now();
  if (now - _lastExplosionTime < 300) return;
  _lastExplosionTime = now;
  if (playSound) playSound();
  const colors = ['#d4a853', '#c9787e', '#8b7ec8', '#6ba3be', '#6bc9a8'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'pixel-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = (i / 12) * Math.PI * 2;
    const dist = Math.random() * 45 + 25;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

/* ===== Cursor Tracker (with proper lifecycle) ===== */
class CursorTracker {
  constructor() {
    this.bugText = document.querySelector('.cursor-bug-text');
    this.mouseX = 0;
    this.mouseY = 0;
    this.bugTexts = [
      'NullPointerException', 'IndexOutOfBounds', 'StackOverflow',
      'OutOfMemory', 'SyntaxError', 'TypeError', 'ReferenceError',
      'FileNotFound', 'NetworkError', 'TimeoutError', 'ValueError',
      'KeyError', 'AttributeError', 'RuntimeError', 'IOError'
    ];
    this.bugIndex = 0;
    this.isAnimating = false;
    this.animating = false;
    this.animationId = null;
    this.bugTimer = null;

    /* Skip entirely on touch devices */
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this.isTouchDevice) return;

    this._onMouseMove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    document.addEventListener('mousemove', this._onMouseMove);

    setTimeout(() => this.showBug(), 500);
    this.animate();
  }

  showBug() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.bugText.classList.remove('bug-exit');
    this.bugText.classList.add('bug-enter');
    this.bugText.textContent = this.bugTexts[this.bugIndex];

    this.bugTimer = setTimeout(() => {
      this.bugText.classList.remove('bug-enter');
      this.bugText.classList.add('bug-exit');

      this.bugTimer = setTimeout(() => {
        this.bugIndex = (this.bugIndex + 1) % this.bugTexts.length;
        this.isAnimating = false;
        this.showBug();
      }, 200);
    }, 1200);
  }

  animate() {
    this.animating = true;
    if (this.bugText) {
      this.bugText.style.left = (this.mouseX + 18) + 'px';
      this.bugText.style.top = (this.mouseY - 8) + 'px';
    }
    this.animationId = requestAnimationFrame(() => {
      if (this.animating) this.animate();
    });
  }

  stop() {
    this.animating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.bugTimer) {
      clearTimeout(this.bugTimer);
      this.bugTimer = null;
    }
    document.removeEventListener('mousemove', this._onMouseMove);
  }
}

/* Expose to global */
window.CanvasAnimation = CanvasAnimation;
window.CodeRain = CodeRain;
window.MeteorShower = MeteorShower;
window.GalleryBackground = GalleryBackground;
window.StarrySky = StarrySky;
window.createPixelExplosion = createPixelExplosion;
window.CursorTracker = CursorTracker;
window.sleep = sleep;