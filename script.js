/* ══════════════════════════════════════════════════
   PARTÍCULAS FLOTANTES
   Pétalos/destellos suaves — inspirado en TikTok
═════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(212,173,116,',
    'rgba(232,207,160,',
    'rgba(236,218,198,',
    'rgba(139,45,53,',
    'rgba(255,248,235,',
  ];

  const PARTICLE_COUNT = 55;
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (initial) {
    this.x          = Math.random() * W;
    this.y          = initial ? Math.random() * H : H + 20;
    this.size       = Math.random() * 5 + 2;
    this.speedY     = -(Math.random() * 0.5 + 0.2);
    this.speedX     = (Math.random() - 0.5) * 0.4;
    this.opacity    = Math.random() * 0.55 + 0.15;
    this.opacityDir = (Math.random() > 0.5 ? 1 : -1) * 0.003;
    this.angle      = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.018;
    this.color      = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape      = Math.floor(Math.random() * 3);
    this.wobble     = Math.random() * Math.PI * 2;
    this.wobbleSpeed= Math.random() * 0.04 + 0.01;
  };

  Particle.prototype.update = function () {
    this.wobble  += this.wobbleSpeed;
    this.x       += this.speedX + Math.sin(this.wobble) * 0.35;
    this.y       += this.speedY;
    this.angle   += this.angleSpeed;
    this.opacity += this.opacityDir;
    if (this.opacity > 0.7)  { this.opacity = 0.7;  this.opacityDir *= -1; }
    if (this.opacity < 0.08) { this.opacity = 0.08; this.opacityDir *= -1; }
    if (this.y < -20) this.reset(false);
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    const c = this.color + this.opacity + ')';

    if (this.shape === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    } else if (this.shape === 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.55, this.size * 1.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    } else {
      const r = this.size * 1.3;
      ctx.strokeStyle = c;
      ctx.lineWidth = 0.8;
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(i * Math.PI / 2) * r, Math.sin(i * Math.PI / 2) * r);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    window.addEventListener('resize', resize);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
  loop();
})();


/* ══════════════════════════════════════════════════
   REPRODUCTOR DE MÚSICA
═════════════════════════════════════════════════ */
const audio = new Audio('./HeavensKnife.mp3');
audio.loop = true;

audio.addEventListener('timeupdate', updateProgress);

function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => setPlayIcon(true)).catch(() => {});
  } else {
    audio.pause();
    setPlayIcon(false);
  }
}

function setPlayIcon(playing) {
  document.getElementById('iconPlay').style.display  = playing ? 'none' : '';
  document.getElementById('iconPause').style.display = playing ? ''     : 'none';
}

function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration * 100);
  document.getElementById('progressBar').style.width = percent + '%';
  const dot = document.getElementById('progressDot');
  if (dot) dot.style.left = percent + '%';
}

function seekMusic(e) {
  if (!audio.duration) return;
  const rect = document.getElementById('progressWrap').getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
}

window.toggleMusic = toggleMusic;
window.seekMusic   = seekMusic;


/* ══════════════════════════════════════════════════
   CUENTA REGRESIVA — 23 enero 2027, 5:00 PM
════════════════════════════════════════════════ */
const WEDDING_DATE = new Date(2027, 0, 23, 17, 0, 0);
function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const ids = ['cd-days','cd-hours','cd-minutes','cd-seconds'];
  if (diff <= 0) { ids.forEach(id => { const el = document.getElementById(id); if(el) el.textContent='00'; }); return; }
  const vals = [
    String(Math.floor(diff / 86400000)).padStart(3,'0'),
    pad(Math.floor((diff % 86400000) / 3600000)),
    pad(Math.floor((diff % 3600000) / 60000)),
    pad(Math.floor((diff % 60000) / 1000)),
  ];
  ids.forEach((id, i) => { const el = document.getElementById(id); if(el) el.textContent = vals[i]; });
}


/* ══════════════════════════════════════════════════
   TIPWRITER EFFECT ON SCROLL
════════════════════════════════════════════════ */
function initTypewriterOnScroll() {
  const elements = document.querySelectorAll('.typewriter-on-scroll');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typewriter-done')) {
          const el = entry.target;
          el.classList.add('typewriter-active');
          el.classList.add('typewriter-done');
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════
   INICIALIZACIÓN
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.fade-in, .fade-up, .fade-scale, .fade-left, .fade-right, .name-slide-left, .ampersand-fade-scale');
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  faders.forEach(f => observer.observe(f));

  updateCountdown();
  setInterval(updateCountdown, 1000);

  initTypewriterOnScroll();

  // Autoplay música al cargar la página
  audio.play().then(() => setPlayIcon(true)).catch(() => {});
});