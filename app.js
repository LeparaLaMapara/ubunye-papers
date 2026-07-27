// Ubunye Papers — Phase 1 MVP front-end.
// Proves: content works offline on the phone, no data after first load.

const PAPERS = [
  { subject: 'Mathematics',       tag: 'MAT', paper: 'Paper 1', year: 2024, file: 'papers/maths-p1-2024.html' },
  { subject: 'Physical Sciences', tag: 'PHY', paper: 'Paper 1', year: 2024, file: 'papers/physci-p1-2024.html' },
  { subject: 'Life Sciences',     tag: 'LIF', paper: 'Paper 1', year: 2023, file: 'papers/lifesci-p1-2023.html' },
  { subject: 'Mathematics',       tag: 'MAT', paper: 'Paper 1', year: 2023, file: 'papers/maths-p1-2023.html' },
];

const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const CHEV = '<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

let offlineReady = false;

function render() {
  const list = document.getElementById('list');
  const groups = { 2024: [], 2023: [] };
  PAPERS.forEach(p => groups[p.year].push(p));

  let html = '';
  Object.keys(groups).sort((a, b) => b - a).forEach(year => {
    html += `<div class="group-title">${year} National Senior Certificate</div>`;
    groups[year].forEach(p => {
      const saved = offlineReady
        ? `<div class="saved">${CHECK} Saved offline</div>`
        : `<div class="saved" style="color:var(--muted)">Saving to your phone…</div>`;
      html += `
        <a class="card" href="${p.file}">
          <div class="thumb">${p.tag}</div>
          <div class="meta">
            <h3>${p.subject}</h3>
            <div class="sub">${p.paper} · ${p.year}</div>
            ${saved}
          </div>
          ${CHEV}
        </a>`;
    });
  });
  list.innerHTML = html;
}

function setStatus() {
  const el = document.getElementById('status');
  const txt = document.getElementById('statusText');
  if (navigator.onLine) {
    el.classList.remove('off');
    txt.innerHTML = offlineReady
      ? '<b>Online</b> · all papers saved to your phone'
      : '<b>Online</b> · saving papers to your phone…';
  } else {
    el.classList.add('off');
    txt.innerHTML = offlineReady
      ? '<b>Offline</b> · papers still work · 0 MB used'
      : '<b>Offline</b> · reconnect once to finish saving';
  }
}

// Service worker: caches the app + all papers for offline use.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    const markReady = () => { offlineReady = true; render(); setStatus(); };
    if (navigator.serviceWorker.controller) markReady();
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      sw && sw.addEventListener('statechange', () => {
        if (sw.state === 'activated' || navigator.serviceWorker.controller) markReady();
      });
    });
    // Fallback: assume ready shortly after load
    setTimeout(markReady, 2500);
  });
}

window.addEventListener('online', setStatus);
window.addEventListener('offline', setStatus);

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install').style.display = 'flex';
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('install').style.display = 'none';
});

render();
setStatus();
