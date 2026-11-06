const CACHE_NAME = 'korei-sevaka-static-v2';
const STATIC_ASSETS = ['/manifest.json', '/icon.svg', '/images/lotus-img.png', '/images/webapp-banner.png', '/images/akash_profile.jpeg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('korei-sevaka-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Authenticated HTML, Next navigation responses, scripts, and API data stay on network.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
    event.request.mode === 'navigate' || url.searchParams.has('_rsc') ||
    !(url.pathname.startsWith('/images/') || STATIC_ASSETS.includes(url.pathname))) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const saved = await cache.match(event.request);
    if (saved) return saved;
    const response = await fetch(event.request);
    if (response.ok && response.type === 'basic') await cache.put(event.request, response.clone());
    return response;
  })());
});
