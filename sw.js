const CACHE_NAME = 'dj-bunny-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/icons/favicon.ico',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  // Add all your sound files with exact paths
  '/script.js',
  '/sounds/effect/haha.mp3',
  '/sounds/effect/smile-small.mp3',
  '/sounds/effect/song-girl.mp3',
  '/sounds/effect/my-mom.mp3',
  '/sounds/effect/hit-ear.mp3',
  '/sounds/effect/fart.mp3',
  '/sounds/effect/don-bell.mp3',
  '/sounds/effect/air-bell.mp3',
  '/sounds/effect/applause-lite.mp3',
  '/sounds/effect/applause-max.mp3',
  '/sounds/effect/oh.mp3',
  '/sounds/effect/smile-small.mp3',
  '/sounds/bgm/rap_fast-friend-wine.mp3',
  '/sounds/bgm/rap_mid-friend-wine.mp3',
  '/sounds/bgm/rap_slow-friend-wine.mp3',
  '/sounds/bgm/hi_welcome-bro.mp3',
  '/sounds/bgm/pk_hall-om-mig.mp3',
  '/sounds/bgm/hi_ymca.mp3',
  '/sounds/bgm/high_ship.mp3',
  '/sounds/bgm/chill_visit-old-fd-dj.mp3',
  '/sounds/bgm/high_car-horn.mp3',
]

// Install the service worker and cache the assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching files...')
        return cache.addAll(urlsToCache)
      })
      .then(() => console.log('All files cached successfully'))
      .catch((error) => console.error('Cache failed:', error))
  )
})

// Fetch the assets from the cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log('Serving from cache:', event.request.url)
          return response
        }

        console.log('Fetching from network:', event.request.url)
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response
          }

          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching new resource:', event.request.url)
            cache.put(event.request, responseToCache)
          })

          return response
        })
      })
      .catch(() => {
        // Fallback to a default offline page or asset if the network is unavailable
        return caches.match('/index.html') // Serve the index.html if offline
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
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
