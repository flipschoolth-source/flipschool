document.addEventListener('DOMContentLoaded', () => {
    
    // --- ส่วนจัดการ PWA (Progressive Web App) ---
    const installButton = document.getElementById('installPWA');
    const iosPopup = document.getElementById('iosInstallPopup');
    let deferredPrompt; // ตัวแปรเก็บ event สำหรับ Chrome/Android

    // ฟังก์ชันตรวจสอบว่าเป็น iOS หรือไม่
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    };

    // ฟังก์ชันตรวจสอบว่าเปิดในโหมดแอปแล้วหรือยัง (Standalone Mode)
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- LOGIC การแสดงปุ่ม ---

    // 1. ถ้าเป็น iOS และยังไม่ได้ติดตั้ง -> ให้โชว์ปุ่มเลย
    if (isIos() && !isInStandaloneMode()) {
        if (installButton) installButton.style.display = 'inline-block';
    }

    // 2. ถ้าเป็น Android/Chrome (รอ event beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
        // ป้องกันแถบติดตั้งอัตโนมัติของ Chrome
        e.preventDefault();
        deferredPrompt = e;
        // แสดงปุ่มติดตั้ง
        if (installButton) installButton.style.display = 'inline-block';
    });

    // --- LOGIC เมื่อกดปุ่ม ---
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (isIos()) {
                // ถ้าเป็น iOS -> เปิด Popup สอนวิธีติดตั้ง
                if (iosPopup) {
                    iosPopup.style.display = 'block';
                }
            } else if (deferredPrompt) {
                // ถ้าเป็น Android -> เรียก Prompt ของระบบ
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    // เคลียร์ค่าเมื่อผู้ใช้เลือกแล้ว
                    deferredPrompt = null;
                });
            } else {
                // กรณีอื่นๆ (เช่นเปิดบนคอมพิวเตอร์ทั่วไป)
                alert('คุณสามารถติดตั้งแอปนี้ได้ผ่านเมนูการตั้งค่าของเบราว์เซอร์');
            }
        });
    }

    // ซ่อนปุ่มติดตั้ง ถ้าเปิดผ่านแอปอยู่แล้ว
    if (isInStandaloneMode() && installButton) {
        installButton.style.display = 'none';
    }
});

// --- ฟังก์ชัน Global (เรียกใช้ผ่าน onclick ใน HTML) ---

// 1. ฟังก์ชันปิด Popup iOS
function closeIosPopup() {
    const iosPopup = document.getElementById('iosInstallPopup');
    if (iosPopup) {
        iosPopup.style.display = 'none';
    }
}

// 2. ฟังก์ชันสลับการแสดงรหัสผ่าน (รองรับทุกช่องด้วย ID)
function togglePassword(icon, inputId) {
    const input = document.getElementById(inputId); 
    
    if (input) {
        if (input.type === "password") {
            input.type = "text"; 
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash"); 
        } else {
            input.type = "password"; 
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye"); 
        }
    }
}
