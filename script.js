document.addEventListener('DOMContentLoaded', () => {
    
    // --- ส่วนจัดการ PWA (Progressive Web App) ---
    let deferredPrompt; 
    const installButton = document.getElementById('installPWA');
    const iosPopup = document.getElementById('iosInstallPopup');

    // ฟังก์ชันตรวจสอบว่าเป็น iOS หรือไม่ (อัปเดตใหม่ รองรับ iPadOS และ Mac ที่เป็นจอสัมผัส)
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };

    // ฟังก์ชันตรวจสอบว่าเปิดในโหมดแอปแล้วหรือยัง
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- LOGIC 1: สำหรับ iOS (แสดงปุ่มเสมอถ้ายังไม่ได้ติดตั้ง) ---
    if (isIos() && !isInStandaloneMode()) {
        if (installButton) {
            // บังคับแสดงปุ่มทันที และใช้ !important ผ่าน JS เพื่อความชัวร์
            installButton.style.setProperty('display', 'inline-block', 'important');
        }
    }

    // --- LOGIC 2: สำหรับ Android (รอ event) ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) {
            installButton.style.setProperty('display', 'inline-block', 'important');
        }
    });

    // --- LOGIC การกดปุ่ม ---
    if (installButton) {
        installButton.addEventListener('click', (e) => {
            if (isIos()) {
                // iOS: เปิด Popup คำแนะนำ
                if (iosPopup) {
                    iosPopup.style.display = 'block';
                }
            } else if (deferredPrompt) {
                // Android: เรียก Prompt ติดตั้ง
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                });
            } else {
                // กรณีอื่นๆ
                alert('คุณสามารถติดตั้งแอปนี้ได้ผ่านเมนูการตั้งค่าของเบราว์เซอร์');
            }
        });
    }

    // ซ่อนปุ่มถ้าติดตั้งแล้ว
    if (isInStandaloneMode() && installButton) {
        installButton.style.display = 'none';
    }
});

// --- ฟังก์ชัน Global ---

// ปิด Popup iOS
function closeIosPopup() {
    const iosPopup = document.getElementById('iosInstallPopup');
    if (iosPopup) {
        iosPopup.style.display = 'none';
    }
}

// สลับการแสดงรหัสผ่าน (ใช้ได้ทุกหน้า)
function togglePassword(icon) {
    // หา input ในกล่องเดียวกัน (sibling) หรือใช้ ID
    // ปรับปรุงให้รองรับ ID 'passwordInput' หรือ input ที่อยู่ข้างๆ
    let input = document.getElementById('passwordInput');
    
    // ถ้าไม่เจอด้วย ID ลองหา input ที่เป็น sibling ก่อนหน้า icon
    if (!input) {
        const wrapper = icon.parentElement;
        input = wrapper.querySelector('input');
    }

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
