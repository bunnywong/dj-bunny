const CACHE_NAME = 'dj-bunny-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  // Add all your sound files with exact paths
  '/sounds/haha.mp3',
  '/sounds/my-mom.mp3',
  '/sounds/hit-ear.mp3',
  '/sounds/fart.mp3',
  '/sounds/don-bell.mp3',
  '/sounds/bo-smile.mp3',
  '/sounds/applause-lite.mp3',
  '/sounds/applause-max.mp3',
]

// Add logging to debug cache status
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

// Add logging to debug fetch events
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Serving from cache:', event.request.url)
        return response
      }

      console.log('Fetching from network:', event.request.url)
      return fetch(event.request.clone()).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
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
  )
})
