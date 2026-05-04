// ── CARGA DE FOTO
function loadPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        const frame = document.getElementById('photoFrame');
        const placeholder = document.getElementById('photoPlaceholder');
        let img = frame.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.alt = 'Foto de la pareja';
            frame.appendChild(img);
        }
        img.src = ev.target.result;
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ── CUENTA REGRESIVA
function getWeddingDate() {
    const val = document.getElementById('weddingDatePicker').value;
    const [y, m, d] = val.split('-').map(Number);
    // Se asume la ceremonia a las 5:00 PM
    return new Date(y, m - 1, d, 17, 0, 0);
}

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
    const now = new Date();
    const target = getWeddingDate();
    const diff = target - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-minutes');
    const secsEl = document.getElementById('cd-seconds');

    if (diff <= 0) {
        if (daysEl) daysEl.textContent = '000';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);
}

// ── ACTUALIZACIÓN DE FECHAS Y TEXTOS
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function updateAll() {
    const val = document.getElementById('weddingDatePicker').value;
    const [y, m, d] = val.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayName = DAYS[date.getDay()];
    const monthName = MONTHS[m - 1];
    
    const detailDate = document.getElementById('detailDate');
    if (detailDate) {
        detailDate.innerHTML = `${dayName}<br/>${d} de ${monthName}, ${y}<br/>5:00 PM`;
    }
    updateCountdown();
}

// ── MAPA
function updateMap() {
    const addr = document.getElementById('mapAddressInput').value.trim();
    if (!addr) return;
    const encoded = encodeURIComponent(addr);
    document.getElementById('mapIframe').src = `https://maps.google.com/maps?q=${encoded}&output=embed&z=15`;
    document.getElementById('mapAddressDisplay').textContent = addr;
    document.getElementById('heroLocation').textContent = addr;
    document.getElementById('detailVenue').innerHTML = addr.replace(/,/g, ',<br/>');
}

// ── INICIALIZACIÓN Y EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    // Sincronización de nombres
    ['name1', 'name2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                const n1 = document.getElementById('name1').value || 'Nicol';
                const n2 = document.getElementById('name2').value || 'Angel';
                document.getElementById('footerNames').textContent = `${n1} & ${n2}`;
            });
        }
    });

    // Animaciones al hacer scroll
    const faders = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    faders.forEach(f => observer.observe(f));

    // Iniciar contador
    setInterval(updateCountdown, 1000);
    updateCountdown();
});

// Hacer funciones accesibles para los atributos inline del HTML
window.loadPhoto = loadPhoto;
window.updateAll = updateAll;
window.updateMap = updateMap;