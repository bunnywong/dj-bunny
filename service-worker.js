const CACHE_NAME = 'my-app-cache-v1'
const urlsToCache = [
  // Add your app's assets here
  '/',
  '/index.html', // Your main HTML file
  '/styles.css', // Your CSS file
  '/script.js', // Your JavaScript file
  // Include all sound files for offline access
  '/sounds/effect/haha.mp3',
  '/sounds/effect/my-mom.mp3',
  '/sounds/effect/hit-ear.mp3',
  '/sounds/effect/fart.mp3',
  '/sounds/effect/don-bell.mp3',
  '/sounds/effect/air-bell.mp3',
  '/sounds/effect/applause-lite.mp3',
  '/sounds/effect/applause-max.mp3',
  '/sounds/effect/oh.mp3',
  '/sounds/bgm/pk_hall-om-mig.mp3',
  '/sounds/bgm/hi_welcome-bro.mp3',
  '/sounds/bgm/hi_ymca.mp3',
  '/sounds/bgm/high_ship.mp3',
  '/sounds/bgm/chill_visit-old-fd-dj.mp3',
  '/sounds/bgm/high_car-horn.mp3',
  // Add any additional audio files you may have
]

// Install the service worker and cache the assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Fetch the assets from the cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached response if found, otherwise fetch from the network
      return response || fetch(event.request)
    })
  )
})

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
