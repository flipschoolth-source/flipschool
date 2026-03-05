// ไฟล์: sw.js
const CACHE_NAME = 'flipschool-v1.1'; // เปลี่ยนเลขเวอร์ชันตรงนี้เวลาที่คุณมีการอัปเดตไฟล์ HTML/CSS ใหญ่ๆ

// ไฟล์พื้นฐานที่อยากให้โหลดเก็บไว้ตอนติดตั้งแอปครั้งแรก
const ASSETS = [
    './',
    './index.html',
    './login.html',
    './dashboard.html',
    './manifest.json',
    './js/config.js',
    './js/supabase-db.js',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. ติดตั้ง Service Worker และเก็บไฟล์พื้นฐานลง Cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 2. 🌟 (เพิ่มใหม่) ทำความสะอาด Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ถ้าชื่อ Cache ไม่ตรงกับเวอร์ชันปัจจุบัน ให้ลบทิ้ง
                    if (cacheName !== CACHE_NAME) {
                        console.log('ลบ Cache เก่า:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. 🌟 (ปรับปรุง) ระบบดึงข้อมูล (Network First, fallback to Cache)
self.addEventListener('fetch', (e) => {
    // กฎข้อที่ 1: ห้าม Cache การดึงข้อมูลจาก Supabase หรือ API ภายนอกเด็ดขาด!
    if (e.request.url.includes('supabase.co') || e.request.method !== 'GET') {
        return; // ปล่อยให้โหลดผ่านเน็ตตามปกติ
    }

    e.respondWith(
        // ลองดึงข้อมูลจากอินเทอร์เน็ตก่อน (เพื่อให้ผู้ใช้ได้หน้าเว็บที่อัปเดตล่าสุดเสมอ)
        fetch(e.request)
            .then((response) => {
                // ถ้าดึงสำเร็จ ให้เอาข้อมูลใหม่ไปอัปเดตทับใน Cache ด้วย
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, resClone);
                });
                return response;
            })
            .catch(() => {
                // กฎข้อที่ 2: ถ้าเน็ตหลุด (Offline) ค่อยไปควานหาไฟล์ที่เคยเก็บไว้ใน Cache มาแสดง
                return caches.match(e.request);
            })
    );
});
