const CACHE_NAME = 'koru-v2'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  // Always bypass caching for Next.js build assets and HMR endpoints
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/__nextjs')) {
    return
  }
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((resp) => {
            // Optionally cache successful basic responses
            const copy = resp.clone()
            if (copy.ok && copy.type === 'basic') {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {})
            }
            return resp
          })
          .catch(() => cached)
      )
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Take control immediately after activation
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))



