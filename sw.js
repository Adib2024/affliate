// Service worker ringkas: web boleh dibuka walaupun internet lemah.
const CACHE = 'racunpost-v14';
// Path relatif supaya berfungsi di GitHub Pages (https://user.github.io/repo/).
const SHELL = [
  './', './index.html', './styles.css', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png',
  './js/app.js', './js/ui/util.js', './js/ui/poster.js', './js/ui/bulk.js', './js/ui/viralui.js',
  './js/engine/data.js', './js/engine/generator.js', './js/engine/spintax.js', './js/engine/linkinfo.js', './js/engine/keywords.js', './js/engine/viral.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Rangkaian dahulu (supaya sentiasa versi terbaru), cache bila offline.
  e.respondWith(
    // cache: 'no-cache' → sentiasa semak dengan server (elak versi lama dari cache HTTP)
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./'))),
  );
});
