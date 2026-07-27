// Ubunye Papers service worker (v2).
// Precache the app shell (incl. the whole catalogue), so every paper and memo
// works offline once the app has been opened once.

const CACHE = 'ubunye-papers-v2';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './catalogue.js',
  './paper.html',
  './viewer.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first. paper.html?id=... is matched by ignoring the query string,
// so any paper opens offline from the single cached paper.html shell.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(hit => {
      if (hit) return hit;
      return caches.match(event.request, { ignoreSearch: true }).then(loose => {
        if (loose) return loose;
        return fetch(event.request).then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, copy)).catch(() => {});
          return res;
        }).catch(() => caches.match('./index.html'));
      });
    })
  );
});
