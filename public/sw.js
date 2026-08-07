const CACHE_NAME = 'matt-squad-cache-v1';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and exclude HMR or extensions
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension:') ||
    event.request.url.includes('/_next/webpack-hmr') ||
    event.request.url.includes('hot-update')
  ) {
    return;
  }

  const url = new URL(event.request.url);

  // Strategy for HTML/Page requests: Network First, Fallback to Cache/Offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Strategy for other requests: Cache First, Fallback to Network (for static assets)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache Next.js static files or fonts dynamically
        if (
          response &&
          response.status === 200 &&
          (url.pathname.includes('/_next/static/') ||
            url.pathname.startsWith('/fonts/'))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
