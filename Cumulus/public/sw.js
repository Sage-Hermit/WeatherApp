const cacheName = "app-cache-v1";
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/main.css',
    'https://kit.fontawesome.com/ee654fe705.js',
    'img/clear.jpg',
    'img/clear2.jpg',
    'img/cloudy.jpg',
    'img/haze.jpg',
    'img/rain.jpg',
    'img/snow.jpg',
    'img/thunderstorm.jpg',
    'icons/01d.png',
    'icons/01n.png',
    'icons/02d.png',
    'icons/02n.png',
    'icons/03d.png',
    'icons/03n.png',
    'icons/04d.png',
    'icons/04n.png',
    'icons/09d.png',
    'icons/09n.png',
    'icons/10d.png',
    'icons/10n.png',
    'icons/11d.png',
    'icons/11n.png',
    'icons/13d.png',
    'icons/13n.png',
    'icons/50n.png',
    'icons/50d.png',
    'icons/unknown.png',
    'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,500;0,600;0,700;1,500&display=swap',
    'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
    'https://kit-free.fontawesome.com/releases/latest/css/free-v4-shims.min.css',
    'https://kit-free.fontawesome.com',
    'https://kit.fontawesome.com'
]

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

self.addEventListener('install', evt => {
    evt.waitUntil(caches.open(cacheName).then(cache => {
        cache.addAll(assets)
    })
    );
    
    //console.log('app installed');
});

//avtivate sw
self.addEventListener('activate', evt => {
    //console.log('activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName && key !== dynamicCache)
                .map(key => caches.delete(key))
                )
        })
        )
});
let dynamicCache = 'dynamic-app';

self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone())
                        limitCacheSize(dynamicCache, 5);
                        return fetchRes;
                    });
                });
            }).catch(() => caches.match('/pages/fallback.html'))
        ) 
    }
})