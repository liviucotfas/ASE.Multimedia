
var cacheName = 'bricks-final-1';
var filesToCache = [
  'index.html',
  'app.js',
  'styles.css',
  'lib/jquery-3.2.1.min.js',
  'img/icons/icon-152x152.png',
  'img/icons/icon-192x192.png'
];

//1. Cache the required files
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

//2. Delete the old version of the cache
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  return self.clients.claim();
});

//3. Fetch files from the cache or from the internet
self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);

  e.respondWith(
    caches.match(e.request)
      .then(function(response) {
        return response || fetch(e.request);
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
        //fetch - returns a promise that resolves to the Response to that request, whether it is successful or not
      })
  );
});