// Ubunye Papers — home screen. Real Grade-12 catalogue from the Multiversity vault.

const SAVED_KEY = 'ubunye.saved';
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

let saved = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
let ENTRIES = [];
let CFG = null;
let activeSubject = 'All';
let query = '';

function persistSaved() { localStorage.setItem(SAVED_KEY, JSON.stringify([...saved])); }

function subjects() {
  const names = Array.from(new Set(ENTRIES.map(e => e.subjectName))).sort();
  return ['All', ...names];
}

function matches(e) {
  const bySubject = activeSubject === 'All' || e.subjectName === activeSubject;
  const hay = `${e.subjectName} ${e.year} paper ${e.paperNo}`.toLowerCase();
  return bySubject && (!query || hay.includes(query.toLowerCase()));
}

function renderChips() {
  document.getElementById('chips').innerHTML = subjects().map(s =>
    `<button class="chip ${s === activeSubject ? 'active' : ''}" data-subject="${s.replace(/"/g, '&quot;')}">${s}</button>`
  ).join('');
}

function card(e) {
  const isSaved = saved.has(e.id);
  const memoPill = e.hasMemo ? '<span class="pill memo">Memo</span>' : '';
  const btn = isSaved
    ? `<button class="save saved" data-id="${e.id}">${CHECK} Saved</button>`
    : `<button class="save" data-id="${e.id}">Save</button>`;
  return `
    <div class="card">
      <a class="thumb" href="paper.html?id=${e.id}">${e.tag}</a>
      <div class="meta">
        <a class="title" href="paper.html?id=${e.id}"><h3>${e.subjectName}</h3></a>
        <div class="sub">Paper ${e.paperNo} &middot; ${e.year}</div>
        <div class="tags"><span class="pill">Grade 12</span>${memoPill}</div>
      </div>
      ${btn}
    </div>`;
}

function renderList() {
  const list = document.getElementById('list');
  const items = ENTRIES.filter(matches);
  if (!items.length) { list.innerHTML = '<p class="empty">No papers match your search.</p>'; return; }
  // Group by subject (A–Z); within a subject, newest year first.
  const bySubject = {};
  items.forEach(e => { (bySubject[e.subjectName] ||= []).push(e); });
  list.innerHTML = Object.keys(bySubject).sort().map(sub => {
    const rows = bySubject[sub].sort((a, b) => b.year - a.year || a.paperNo - b.paperNo);
    return `<div class="group-title">${sub}</div>` + rows.map(card).join('');
  }).join('');
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
    : 'Nothing saved yet &mdash; open a paper and tap Save.';
}

function setStatus(extra) {
  const el = document.getElementById('status');
  const txt = document.getElementById('statusText');
  if (navigator.onLine) {
    el.classList.remove('off');
    txt.innerHTML = extra || '<b>Online</b> &middot; ' + ENTRIES.length + ' Grade-12 papers from the vault';
  } else {
    el.classList.add('off');
    txt.innerHTML = '<b>Offline</b> &middot; saved papers still open &middot; browsing uses no data';
  }
}

// Save = download the PDF(s) now so they open with no data later.
async function savePaper(id, btn) {
  const e = ENTRIES.find(x => x.id === id);
  if (!e) return;
  const urls = [e.paperUrl, e.memoUrl].filter(Boolean);
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }
  try {
    const cache = await caches.open('ubunye-pdfs');
    await Promise.all(urls.map(u => cache.add(u).catch(() => {})));
    saved.add(id); persistSaved();
  } catch (e) { /* leave unsaved on failure */ }
  if (btn) btn.disabled = false;
}

document.addEventListener('click', async e => {
  const chip = e.target.closest('.chip');
  if (chip) { activeSubject = chip.dataset.subject; renderChips(); renderList(); return; }
  const btn = e.target.closest('.save');
  if (btn) {
    const id = btn.dataset.id;
    if (saved.has(id)) { saved.delete(id); persistSaved(); }
    else await savePaper(id, btn);
    renderList(); renderStorage();
  }
});

document.getElementById('search').addEventListener('input', e => { query = e.target.value; renderList(); });
window.addEventListener('online', () => setStatus());
window.addEventListener('offline', () => setStatus());

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', ev => {
  ev.preventDefault(); deferredPrompt = ev;
  document.getElementById('install').style.display = 'flex';
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt = null; document.getElementById('install').style.display = 'none';
});

(async function init() {
  try {
    const { cfg, entries } = await loadCatalogue();
    CFG = cfg; ENTRIES = entries;
    renderChips(); renderList(); renderStorage(); setStatus();
  } catch (err) {
    document.getElementById('list').innerHTML =
      '<p class="empty">Could not load the catalogue. Connect once and reopen.</p>';
  }
})();
