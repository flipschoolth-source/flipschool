// รอให้หน้าเว็บโหลดเสร็จสมบูรณ์ก่อนทำงาน
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ส่วนจัดการ PWA (Progressive Web App) ---
    let deferredPrompt; // ตัวแปรเก็บ event สำหรับ Chrome/Android
    const installButton = document.getElementById('installPWA');
    const iosPopup = document.getElementById('iosInstallPopup');

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

    // 1. Logic สำหรับ Chrome/Android/Desktop (เก็บ event ไว้ใช้)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (installButton) {
            installButton.style.display = 'inline-block';
        }
    });

    // 2. Logic สำหรับ iOS
    if (isIos() && !isInStandaloneMode()) {
        if (installButton) {
            installButton.style.display = 'inline-block';
        }
    }

    // เมื่อกดปุ่ม "ติดตั้งแอป"
    if (installButton) {
        installButton.addEventListener('click', (e) => {
            if (isIos()) {
                if (iosPopup) {
                    iosPopup.style.display = 'block';
                }
            } else if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                });
            } else {
                alert('คุณสามารถติดตั้งแอปนี้ได้ผ่านเมนูการตั้งค่าของเบราว์เซอร์');
            }
        });
    }

    // ซ่อนปุ่มติดตั้ง ถ้าเปิดผ่านแอปอยู่แล้ว
    if (isInStandaloneMode() && installButton) {
        installButton.style.display = 'none';
    }
});

// --- ฟังก์ชัน Global ---

// 1. ฟังก์ชันปิด Popup iOS
function closeIosPopup() {
    const iosPopup = document.getElementById('iosInstallPopup');
    if (iosPopup) {
        iosPopup.style.display = 'none';
    }
}

// 2. ฟังก์ชันสลับการแสดงรหัสผ่าน (แก้ไขใหม่ รองรับทุกช่อง)
// เพิ่ม parameter 'inputId' เพื่อรับชื่อ ID ของช่อง input นั้นๆ
function togglePassword(icon, inputId) {
    // ใช้ inputId ที่ส่งมา แทนการระบุชื่อตายตัว
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
    } else {
        console.error("ไม่พบ Element ที่มี ID: " + inputId);
    }
}
