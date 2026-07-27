// Ubunye Papers service worker (v3).
// Shell is precached. The catalogue is network-first (stays fresh).
// PDFs from the vault are cached on demand (Save / open) and served offline.

const CACHE = 'ubunye-papers-v3';
const PDF_CACHE = 'ubunye-pdfs';

const ASSETS = [
  './', './index.html', './styles.css', './lib.js', './app.js',
  './paper.html', './viewer.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './catalogue.json',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== PDF_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Catalogue: network-first so new papers show up; fall back to cache offline.
  if (url.pathname.endsWith('/catalogue.json')) {
    event.respondWith(
      fetch(event.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Everything else (shell + vault PDFs): cache-first across all caches.
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(event.request).then(res => {
        if (res.ok) {
          const isPdf = url.pathname.endsWith('.pdf');
          const target = isPdf ? PDF_CACHE : CACHE;
          const copy = res.clone();
          caches.open(target).then(c => c.put(event.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
