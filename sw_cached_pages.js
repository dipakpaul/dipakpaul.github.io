// How to cache individual pages
const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    'about.html',
    'css/style.css',
    'js/main.js'
];

// Call Install Event
self.addEventListener('install', e => {
    console.log(`Service Worker: Installed`);

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    )
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log(`Service Worker: Activated`);

    // Remove unwanted cache
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log(`Service Worker: Clearing old cache`);
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
});