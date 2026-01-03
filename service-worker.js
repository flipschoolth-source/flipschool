const CACHE_NAME = 'flipschool-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ios-fix.js',
  './img/favicon.png',
  './img/cover01.jpg',
  './img/logo.png'
];

// ติดตั้ง Service Worker และ Cache ไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ดึงข้อมูลจาก Cache เมื่อ Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
