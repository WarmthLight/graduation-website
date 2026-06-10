/* ===== Certificate Ring ===== */
class CertificateRing {
  constructor() {
    this.ring = document.querySelector('.certificate-ring');
    this.certificates = document.querySelectorAll('.certificate');
    this.lightbox = null;
    this._createLightbox();
    this._bindClickEvents();
  }

  _createLightbox() {
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'cert-lightbox';
    this.lightbox.innerHTML = '<div class="cert-lightbox-inner"><img src="" alt=""><span class="cert-lightbox-name"></span><button class="cert-lightbox-close">&times;</button></div>';
    document.body.appendChild(this.lightbox);

    this.lightbox.querySelector('.cert-lightbox-close').addEventListener('click', () => this._closeLightbox());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this._closeLightbox();
    });
  }

  _bindClickEvents() {
    this.certificates.forEach(cert => {
      cert.addEventListener('click', (e) => {
        e.stopPropagation();
        const img = cert.querySelector('img');
        const name = cert.getAttribute('data-name');
        this._openLightbox(img.src, name);
      });
      cert.style.cursor = 'pointer';
    });
  }

  _openLightbox(src, name) {
    const img = this.lightbox.querySelector('img');
    const label = this.lightbox.querySelector('.cert-lightbox-name');
    img.src = src;
    label.textContent = name || '';
    this.lightbox.classList.add('active');
  }

  _closeLightbox() {
    this.lightbox.classList.remove('active');
  }

  flyIn() {
    return new Promise(resolve => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const directions = [
        { x: -200, y: cy },
        { x: window.innerWidth + 200, y: cy },
        { x: cx, y: -200 },
        { x: cx, y: window.innerHeight + 200 },
        { x: -200, y: -200 },
        { x: window.innerWidth + 200, y: window.innerHeight + 200 }
      ];

      this.certificates.forEach((cert, i) => {
        const dir = directions[i % directions.length];
        cert.style.position = 'absolute';
        cert.style.left = dir.x + 'px';
        cert.style.top = dir.y + 'px';
        cert.style.opacity = '0';
        cert.style.transform = 'rotate(' + (Math.random() * 360) + 'deg) scale(0.3)';

        setTimeout(() => {
          cert.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
          cert.style.opacity = '1';
          cert.style.transform = 'rotate(0deg) scale(1)';
          cert.classList.add('fly-in');
        }, i * 100);
      });

      setTimeout(resolve, this.certificates.length * 100 + 700);
    });
  }

  startRotation() {
    const scene3 = document.getElementById('scene3');
    if (scene3) scene3.classList.add('blurred');

    const count = this.certificates.length;
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? Math.min(110, window.innerWidth * 0.28) : Math.min(180, window.innerWidth * 0.2);

    /* Use the ring element dimensions, falling back to viewport-based sizing */
    const ringW = this.ring.offsetWidth || window.innerWidth * 0.8;
    const ringH = this.ring.offsetHeight || window.innerHeight * 0.6;
    const cx = ringW / 2;
    const cy = ringH / 2;

    this.certificates.forEach((cert, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius - cert.offsetWidth / 2;
      const y = cy + Math.sin(angle) * radius - cert.offsetHeight / 2;

      cert.style.transition = 'all 0.8s ease';
      cert.style.left = x + 'px';
      cert.style.top = y + 'px';
      cert.classList.add('rotating');
    });
  }

  destroy() {
    this._closeLightbox();
    if (this.lightbox && this.lightbox.parentNode) {
      this.lightbox.parentNode.removeChild(this.lightbox);
    }
  }
}

/* ===== Graduation Bubbles (Heart Shape) ===== */
class GraduationBubbles {
  constructor() {
    this.container = document.querySelector('.graduation-message');
    this.bubbles = [];
    this.blessings = [
      '前程似锦', '未来可期', '不负韶华', '毕业快乐',
      '前程万里', '鹏程万里', '一帆风顺', '马到成功',
      '步步高升', '心想事成', '万事如意', '扬帆起航',
      '展翅高飞', '大展宏图', '学业有成', '金榜题名',
      '青春无悔', '梦想成真', '友谊长存', '感恩遇见',
      '不负青春', '未来闪耀', '梦想起航', '勇敢前行',
      '一路顺风', '前路漫漫', '未来可期', '星辰大海'
    ];
    this.colors = ['cyan', 'magenta', 'green', 'purple', 'pink', 'yellow'];

    /* Heart shape matrix (10 rows x 11 cols) */
    this.heartMatrix = [
      [0,0,1,1,0,0,0,1,1,0,0],
      [0,1,1,1,1,0,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0]
    ];
  }

  createBubble(text, index) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble ' + this.colors[index % this.colors.length];
    bubble.textContent = text;
    bubble.style.animationDelay = (index * 0.03) + 's';
    return bubble;
  }

  async generateBubbles() {
    this.container.innerHTML = '';
    let idx = 0;

    const heartContainer = document.createElement('div');
    heartContainer.className = 'char-container';
    this.container.appendChild(heartContainer);

    for (let row = 0; row < this.heartMatrix.length; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'char-row';
      heartContainer.appendChild(rowDiv);

      for (let col = 0; col < this.heartMatrix[row].length; col++) {
        if (this.heartMatrix[row][col] === 1) {
          const b = this.createBubble(this.blessings[idx % this.blessings.length], idx);
          rowDiv.appendChild(b);
          this.bubbles.push(b);
          idx++;
          await sleep(25);
        } else {
          const s = document.createElement('div');
          s.style.width = '58px';
          s.style.height = '36px';
          rowDiv.appendChild(s);
        }
      }
    }

    await sleep(800);
    return this.bubbles;
  }

  destroy() {
    this.bubbles = [];
    if (this.container) this.container.innerHTML = '';
  }
}

window.CertificateRing = CertificateRing;
window.GraduationBubbles = GraduationBubbles;