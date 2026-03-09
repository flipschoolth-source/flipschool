// ไฟล์: sw.js
// อัปเดตเวอร์ชันเป็น v2.0 (ล้างแคชเก่ารวมถึง student-login)
const CACHE_NAME = 'flipschool-v2.0'; 

// รายการไฟล์ที่ต้องการให้โหลดแบบ Offline ได้
const ASSETS = [
    './',
    './index.html',
    './login.html',
    './dashboard.html',
    './classroom-detail.html',
    './mission-library.html',
    './mission-play.html',
    './manifest.json',
    './js/config.js',
    './js/supabase-db.js',
    './js/env-config.js',
    './img/favicon.png',
    './img/cover01.jpg',
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
                        return caches.delete(cacheName); // ลบแคชเวอร์ชันเก่าทิ้ง
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Stale-while-revalidate strategy สำหรับไฟล์ทั่วไป และ Bypass สำหรับ API (Supabase)
self.addEventListener('fetch', (e) => {
    // ข้ามการแคชสำหรับ API ของ Supabase และ Chrome Extension
    if (e.request.url.includes('supabase.co') || e.request.url.includes('chrome-extension') || e.request.method !== 'GET') {
        return;
    }
    
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            const fetchPromise = fetch(e.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(() => {
                // กรณีออฟไลน์
            });
            return cachedResponse || fetchPromise;
        })
    );
});
