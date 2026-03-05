// ไฟล์: sw.js
// อัปเดตเป็น v1.5 เพื่อบังคับเบราว์เซอร์ให้โหลด Manifest และไอคอนใหม่
const CACHE_NAME = 'flipschool-v1.5'; 

const ASSETS = [
    './',
    './index.html',
    './login.html',
    './dashboard.html',
    './manifest.json',
    './js/config.js',
    './js/supabase-db.js',
    './img/favicon.png',
    'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cleaning old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('supabase.co') || e.request.method !== 'GET') {
        return;
    }
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, resClone);
                });
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});
