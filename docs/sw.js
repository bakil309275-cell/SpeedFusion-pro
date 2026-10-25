// Service Worker: يخزّن ملفات التطبيق فقط. لا يلمس أي طلب خارجي (اختبارات السرعة وDNS تمرّ مباشرة).
const CACHE = 'speedfusion-v3.0.0';
const ASSETS = ['./', 'index.html', 'app.css', 'app.js', 'manifest.json', 'privacy.html',
  'icons/icon-96x96.png', 'icons/icon-192x192.png', 'icons/icon-512x512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return; // الشبكة مباشرة

  // الصفحات: الشبكة أولاً ثم النسخة المخزنة عند انقطاع الاتصال
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }
  // باقي الملفات: من الذاكرة فوراً مع تحديثها بالخلفية
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
