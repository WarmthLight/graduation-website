/* ===== Main Controller ===== */
class GraduationWebsite {
  constructor() {
    this.currentScene = 1;
    this.scenes = document.querySelectorAll('.scene');
    this.codeRain = null;
    this.meteorShower = null;
    this.galleryBg = null;
    this.starrySky = null;
    this.cursorTracker = null;
    this.certificateRing = null;
    this.graduationBubbles = null;
    this.isTransitioning = false;

    /* Audio */
    this.bgm = document.getElementById('bgm');
    this.clickSound = document.getElementById('clickSound');
    this.bgmBtn = document.getElementById('bgmToggle');
    this.bgmPlaying = false;

    this.init();
  }

  init() {
    /* iOS Safari 100vh fallback: set --vh CSS variable */
    this._setVhVariable();
    this._initMobileFixes();
    this.cursorTracker = new CursorTracker();

    const codeRainCanvas = document.getElementById('codeRain');
    if (codeRainCanvas) {
      this.codeRain = new CodeRain(codeRainCanvas);
      this.codeRain.animate();
    }

    this._bindEvents();
    this._initAudio();
    window.addEventListener('resize', () => this._handleResize());
  }

  /* ---- Audio ---- */
  _initAudio() {
    if (this.bgmBtn) {
      this.bgmBtn.addEventListener('click', () => this._toggleBgm());
    }
    /* Auto-play attempt on first user interaction (click or touch) */
    const tryPlay = () => {
      if (this.bgm && !this.bgmPlaying) {
        this.bgm.volume = 0.35;
        this.bgm.play().then(() => {
          this.bgmPlaying = true;
          if (this.bgmBtn) this.bgmBtn.textContent = '♫';
        }).catch(() => {});
      }
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay, { passive: true });
  }

  _toggleBgm() {
    if (!this.bgm) return;
    if (this.bgmPlaying) {
      this.bgm.pause();
      this.bgmPlaying = false;
      if (this.bgmBtn) this.bgmBtn.classList.add('muted');
    } else {
      this.bgm.play().then(() => {
        this.bgmPlaying = true;
        if (this.bgmBtn) this.bgmBtn.classList.remove('muted');
      }).catch(() => {});
    }
  }

  _playClickSound() {
    if (!this.clickSound) return;
    this.clickSound.currentTime = 0;
    this.clickSound.play().catch(() => {});
  }

  /* ---- Events ---- */
  _bindEvents() {
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        if (!this.isTransitioning) {
          createPixelExplosion(e.clientX, e.clientY, () => this._playClickSound());
          this._startTransition();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.pixel-btn') || e.target.closest('.certificate-hall') || e.target.closest('.cert-lightbox')) return;
      createPixelExplosion(e.clientX, e.clientY, () => this._playClickSound());
    });

    document.getElementById('scene3')?.addEventListener('click', (e) => {
      if (this.currentScene === 3 && !this.isTransitioning && e.target.closest('.certificate-hall')) {
        this._continueToScene4();
      }
    });

    document.getElementById('scene5')?.addEventListener('click', () => {
      if (this.currentScene === 5) this._restart();
    });
  }

  /* ---- Scene Transitions ---- */
  async _startTransition() {
    this.isTransitioning = true;

    await this._hideScene(1);
    await sleep(200);

    this._showScene(2);
    const meteorCanvas = document.getElementById('meteorShower');
    if (meteorCanvas) {
      this._safeDestroy(this.meteorShower);
      this.meteorShower = new MeteorShower(meteorCanvas);
      this.meteorShower.animate();
    }
    await sleep(2500);
    if (this.meteorShower) this.meteorShower.stop();

    await this._hideScene(2);
    await sleep(200);

    this._showScene(3);
    await this._initCertificateScene();
    this.isTransitioning = false;
  }

  async _continueToScene4() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    await this._hideScene(3);
    await sleep(200);

    this._showScene(4);
    this._initGalleryScene();
    await sleep(3500);

    await this._hideScene(4);
    await sleep(200);

    this._showScene(5);
    await this._initGraduationScene();

    this.isTransitioning = false;
    this.currentScene = 5;
  }

  async _initCertificateScene() {
    this._safeDestroy(this.certificateRing);
    this.certificateRing = new CertificateRing();
    await this.certificateRing.flyIn();
    await sleep(400);
    this.certificateRing.startRotation();
  }

  _initGalleryScene() {
    const galleryCanvas = document.getElementById('galleryBg');
    if (galleryCanvas) {
      this._safeDestroy(this.galleryBg);
      this.galleryBg = new GalleryBackground(galleryCanvas);
      this.galleryBg.animate();
    }
  }

  async _initGraduationScene() {
    this._safeDestroy(this.galleryBg);
    this.galleryBg = null;

    const starsCanvas = document.getElementById('starsBg');
    if (starsCanvas) {
      this._safeDestroy(this.starrySky);
      this.starrySky = new StarrySky(starsCanvas);
      this.starrySky.animate();
    }
    this._safeDestroy(this.graduationBubbles);
    this.graduationBubbles = new GraduationBubbles();
    await this.graduationBubbles.generateBubbles();
  }

  /* ---- Scene Helpers ---- */
  _showScene(n) {
    const scene = document.getElementById('scene' + n);
    if (scene) {
      scene.classList.add('active');
      this.currentScene = n;
    }
  }

  async _hideScene(n) {
    const scene = document.getElementById('scene' + n);
    if (scene) {
      scene.classList.remove('active');
    }
  }

  /* ---- Restart ---- */
  async _restart() {
    this._safeDestroy(this.codeRain);
    this._safeDestroy(this.meteorShower);
    this._safeDestroy(this.galleryBg);
    this._safeDestroy(this.starrySky);
    this._safeDestroy(this.graduationBubbles);
    this._safeDestroy(this.certificateRing);

    this.scenes.forEach(s => {
      s.classList.remove('active', 'blurred');
    });

    this.currentScene = 1;
    this.isTransitioning = false;

    await sleep(400);

    this._showScene(1);
    const codeRainCanvas = document.getElementById('codeRain');
    if (codeRainCanvas) {
      this.codeRain = new CodeRain(codeRainCanvas);
      this.codeRain.animate();
    }

    document.querySelectorAll('.certificate').forEach(c => {
      c.classList.remove('fly-in', 'rotating');
      c.style.filter = '';
      c.style.transition = '';
    });
  }

  /* ---- Resize ---- */
  _handleResize() {
    this._setVhVariable();
    if (this.codeRain) this.codeRain.resize();
    if (this.meteorShower) this.meteorShower.init();
    if (this.galleryBg) this.galleryBg.init();
    if (this.starrySky) this.starrySky.init();
    /* Recalculate certificate ring positions on resize */
    if (this.certificateRing && this.currentScene === 3) {
      this.certificateRing.startRotation();
    }
  }

  /* ---- iOS Safari 100vh fix ---- */
  _setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  /* ---- Mobile Fixes ---- */
  _initMobileFixes() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    /* Prevent iOS rubber-band overscroll */
    document.body.addEventListener('touchmove', (e) => {
      if (e.target.closest('.cert-lightbox')) return; /* allow lightbox scroll */
      e.preventDefault();
    }, { passive: false });

    /* Prevent long-press context menu */
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    /* Handle orientation change */
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this._handleResize(), 200);
    });
  }

  /* ---- Safe Destroy (supports objects with stop() or destroy()) ---- */
  _safeDestroy(obj) {
    if (!obj) return;
    if (typeof obj.destroy === 'function') obj.destroy();
    else if (typeof obj.stop === 'function') obj.stop();
  }
}

/* ===== Bootstrap ===== */
document.addEventListener('DOMContentLoaded', () => {
  const images = [
    'images/portrait/单人.jpg', 'images/portrait/剑来.jpg',
    'images/portrait/双人.jpg', 'images/portrait/群像.jpg',
    'images/certificate/实用新型专利证书.jpg', 'images/certificate/青年科普实验创新.jpg',
    'images/certificate/计算机应用大赛.jpg',
    'images/certificate/provincial-cpp.jpg',
    'images/certificate/第八届互联网plus.jpg', 'images/certificate/第九届互联网plus.jpg'
  ];

  let loaded = 0;
  let started = false;

  function onDone() {
    loaded++;
    if (loaded >= images.length && !started) {
      started = true;
      window.graduationWebsite = new GraduationWebsite();
    }
  }

  images.forEach(src => {
    const img = new Image();
    img.onload = onDone;
    img.onerror = onDone;
    img.src = src;
  });

  setTimeout(() => {
    if (!started) {
      started = true;
      window.graduationWebsite = new GraduationWebsite();
    }
  }, 5000);
});