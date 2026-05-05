// ── CUENTA REGRESIVA
// Fecha fija de la boda: 23 de enero de 2027, 5:00 PM
const WEDDING_DATE = new Date(2027, 0, 23, 17, 0, 0);

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();

  const daysEl   = document.getElementById('cd-days');
  const hoursEl  = document.getElementById('cd-hours');
  const minsEl   = document.getElementById('cd-minutes');
  const secsEl   = document.getElementById('cd-seconds');

  if (diff <= 0) {
    [daysEl, hoursEl, minsEl, secsEl].forEach(el => { if (el) el.textContent = '00'; });
    return;
  }

  if (daysEl)  daysEl.textContent  = String(Math.floor(diff / 86400000)).padStart(3, '0');
  if (hoursEl) hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  if (minsEl)  minsEl.textContent  = pad(Math.floor((diff % 3600000) / 60000));
  if (secsEl)  secsEl.textContent  = pad(Math.floor((diff % 60000) / 1000));
}

// ── INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  // Animaciones al hacer scroll
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  faders.forEach(f => observer.observe(f));

  // Iniciar cuenta regresiva
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Accesibles desde HTML inline
window.loadPhoto = loadPhoto;