const CACHE_NAME = 'dj-bunny-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  // Add your sound files here
  '/sounds/sound_haha.mp3',
  '/sounds/sound_my-mom.mp3',
  '/sounds/sound_hit-ear.mp3',
  '/sounds/sound_fart.mp3',
  '/sounds/sound_don-bell.mp3',
  '/sounds/sound_bo-smile.mp3',
  '/sounds/sound_whats-jp.mp3',
  '/sounds/sound_applause-lite.mp3',
  '/sounds/sound_applause-max.mp3',
  '/sounds/sound_ball-game-hyper.mp3',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  )
})
