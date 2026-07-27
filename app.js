// Ubunye Papers — home screen.
// Browse catalogue, search/filter, and save papers for offline use (per paper).

const SAVED_KEY = 'ubunye.saved';
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

let saved = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
let activeSubject = 'All';
let query = '';

function persistSaved() { localStorage.setItem(SAVED_KEY, JSON.stringify([...saved])); }

function subjects() {
  return ['All', ...Array.from(new Set(CATALOGUE.map(p => p.subject)))];
}

function matches(p) {
  const bySubject = activeSubject === 'All' || p.subject === activeSubject;
  const hay = `${p.subject} ${p.paper} ${p.year} ${p.tag}`.toLowerCase();
  const byQuery = !query || hay.includes(query.toLowerCase());
  return bySubject && byQuery;
}

function renderChips() {
  document.getElementById('chips').innerHTML = subjects().map(s =>
    `<button class="chip ${s === activeSubject ? 'active' : ''}" data-subject="${s}">${s}</button>`
  ).join('');
}

function card(p) {
  const isSaved = saved.has(p.id);
  const memoPill = p.hasMemo ? '<span class="pill memo">Memo</span>' : '';
  const btn = isSaved
    ? `<button class="save saved" data-id="${p.id}">${CHECK} Saved</button>`
    : `<button class="save" data-id="${p.id}">Save</button>`;
  return `
    <div class="card">
      <a class="thumb" href="paper.html?id=${p.id}">${p.tag}</a>
      <div class="meta">
        <a class="title" href="paper.html?id=${p.id}"><h3>${p.subject}</h3></a>
        <div class="sub">${p.paper} &middot; ${p.year} &middot; ${p.sizeKB} KB</div>
        <div class="tags"><span class="pill">${p.duration}</span>${memoPill}</div>
      </div>
      ${btn}
    </div>`;
}

function renderList() {
  const list = document.getElementById('list');
  const items = CATALOGUE.filter(matches);
  if (!items.length) { list.innerHTML = '<p class="empty">No papers match your search.</p>'; return; }
  const years = Array.from(new Set(items.map(p => p.year))).sort((a, b) => b - a);
  list.innerHTML = years.map(y =>
    `<div class="group-title">${y} National Senior Certificate</div>` +
    items.filter(p => p.year === y).map(card).join('')
  ).join('');
}

async function renderStorage() {
  const el = document.getElementById('storage');
  const count = saved.size;
  let usage = '';
  if (navigator.storage && navigator.storage.estimate) {
    const { usage: u } = await navigator.storage.estimate();
    if (u) usage = ` &middot; ~${(u / 1024 / 1024).toFixed(1)} MB on this phone`;
  }
  el.innerHTML = count
    ? `${count} paper${count > 1 ? 's' : ''} saved for offline${usage}`
    : 'Nothing saved yet &mdash; tap Save on a paper.';
}

function setStatus() {
  const el = document.getElementById('status');
  const txt = document.getElementById('statusText');
  if (navigator.onLine) {
    el.classList.remove('off');
    txt.innerHTML = '<b>Online</b> &middot; save papers now so they work later';
  } else {
    el.classList.add('off');
    txt.innerHTML = '<b>Offline</b> &middot; saved papers still open &middot; 0 MB used';
  }
}

// Save a paper: cache its viewer URL so it opens with no network.
async function savePaper(id) {
  const url = `paper.html?id=${id}`;
  try {
    if ('caches' in window) {
      const cache = await caches.open('ubunye-papers-v2');
      await cache.add(url);
    }
  } catch (e) { /* still mark saved; shell already covers the viewer */ }
  saved.add(id); persistSaved();
}

async function removePaper(id) {
  saved.delete(id); persistSaved();
}

document.addEventListener('click', async e => {
  const chip = e.target.closest('.chip');
  if (chip) { activeSubject = chip.dataset.subject; renderChips(); renderList(); return; }
  const btn = e.target.closest('.save');
  if (btn) {
    const id = btn.dataset.id;
    if (saved.has(id)) await removePaper(id); else await savePaper(id);
    renderList(); renderStorage();
  }
});

document.getElementById('search').addEventListener('input', e => {
  query = e.target.value; renderList();
});

window.addEventListener('online', setStatus);
window.addEventListener('offline', setStatus);

// Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  document.getElementById('install').style.display = 'flex';
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt = null; document.getElementById('install').style.display = 'none';
});

renderChips();
renderList();
renderStorage();
setStatus();
