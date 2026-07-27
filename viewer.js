// Ubunye Papers — viewer. Loads the real PDF from the vault; works offline once saved.

const SAVED_KEY = 'ubunye.saved';
function param(n) { return new URLSearchParams(location.search).get(n); }

const id = param('id');
let entry = null;
let kind = 'paper';
let currentUrl = null;

const barTitle = document.getElementById('barTitle');
const tabs = document.getElementById('tabs');
const msg = document.getElementById('msg');
const frame = document.getElementById('frame');
const openBtn = document.getElementById('openBtn');
const saveBtn = document.getElementById('saveBtn');

function isSaved() {
  const s = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
  return s.has(id);
}
function setSavedState() { saveBtn.textContent = isSaved() ? 'Saved ✓' : 'Save'; }

function renderTabs() {
  const t = [];
  if (entry.hasPaper) t.push(['paper', 'Paper']);
  if (entry.hasMemo) t.push(['memo', 'Memo']);
  tabs.innerHTML = t.map(([k, label]) =>
    `<button class="vtab ${k === kind ? 'active' : ''}" data-kind="${k}">${label}</button>`
  ).join('');
}

async function show(k) {
  kind = k;
  renderTabs();
  const url = k === 'memo' ? entry.memoUrl : entry.paperUrl;
  msg.style.display = 'block';
  msg.textContent = 'Loading…';
  frame.style.display = 'none';
  openBtn.style.display = 'none';
  if (currentUrl) { URL.revokeObjectURL(currentUrl); currentUrl = null; }
  try {
    const res = await fetch(url);          // SW serves from cache when offline
    if (!res.ok) throw new Error('http ' + res.status);
    const blob = await res.blob();
    currentUrl = URL.createObjectURL(blob);
    frame.src = currentUrl;
    openBtn.href = currentUrl;
    frame.style.display = 'block';
    openBtn.style.display = 'inline-block';
    msg.style.display = 'none';
  } catch (err) {
    msg.innerHTML = navigator.onLine
      ? 'Could not load this PDF. Please try again.'
      : 'Not saved for offline. Go online once and tap <b>Save</b>.';
  }
}

async function save() {
  const urls = [entry.paperUrl, entry.memoUrl].filter(Boolean);
  saveBtn.textContent = 'Saving…'; saveBtn.disabled = true;
  try {
    const cache = await caches.open('ubunye-pdfs');
    await Promise.all(urls.map(u => cache.add(u).catch(() => {})));
    const s = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
    s.add(id); localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
  } catch (e) { /* ignore */ }
  saveBtn.disabled = false; setSavedState();
}

tabs.addEventListener('click', e => {
  const b = e.target.closest('.vtab');
  if (b) show(b.dataset.kind);
});
saveBtn.addEventListener('click', () => { if (!isSaved()) save(); });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

(async function init() {
  try {
    const { entries } = await loadCatalogue();
    entry = entries.find(e => e.id === id);
    if (!entry) { barTitle.textContent = 'Not found'; msg.textContent = 'Paper not in the catalogue.'; tabs.style.display = 'none'; saveBtn.style.display = 'none'; return; }
    barTitle.textContent = `${entry.subjectName} P${entry.paperNo} · ${entry.year}`;
    kind = entry.hasPaper ? 'paper' : 'memo';
    setSavedState();
    show(kind);
  } catch (err) {
    msg.textContent = 'Could not load. Connect once and reopen.';
  }
})();
