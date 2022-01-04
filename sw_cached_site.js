// How to cache individual pages
const cacheName = 'v2';

// Call Install Event
self.addEventListener('install', e => {
    console.log(`Service Worker: Installed`);
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
        fetch(e.request)
            .then(res => {
                // Make a copy/clone of response
                const resClone = res.clone();
                // Open a cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // Add response to the cache
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request).then(res => res))
    )
});