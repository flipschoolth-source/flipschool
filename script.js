// --- ส่วนจัดการปุ่มติดตั้ง (Logic จาก TAS-SPB) ---
let deferredPrompt;
const installContainer = document.getElementById('installContainer');
const iosPrompt = document.getElementById('iosPrompt');

// ตรวจสอบว่าเป็น Standalone (ติดตั้งแล้ว) หรือไม่
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// ตรวจสอบ iOS ด้วย Regex ง่ายๆ (ครอบคลุม Chrome/Safari บน iOS)
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
    
    // ถ้ายังไม่ได้ติดตั้ง (ไม่ว่า Android หรือ iOS)
    if (!isStandalone) {
        
        // 1. Logic สำหรับ Android/Desktop Chrome
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // แสดงปุ่ม
            showInstallButton();
        });

        // 2. Logic สำหรับ iOS (บังคับโชว์ปุ่มเลย ไม่ต้องรอ Event)
        if (isIOS) {
            showInstallButton();
        }
    }
});

function showInstallButton() {
    if (installContainer) {
        // ใช้ Class 'show' เพื่อให้ CSS จัดการ (Desktop: Inline, Mobile: Bottom Fixed)
        installContainer.classList.add('show');
    }
}

function installApp() {
    if (isIOS) {
        // iOS: แสดง Popup แนะนำวิธีติดตั้ง
        iosPrompt.style.display = 'flex';
    } else if (deferredPrompt) {
        // Android: เรียก Prompt ของระบบ
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                installContainer.classList.remove('show');
            }
            deferredPrompt = null;
        });
    } else {
        // Fallback กรณีอื่นๆ (เช่น Desktop Safari หรือ Chrome เก่า)
        alert('กรุณากดเมนูของเบราว์เซอร์แล้วเลือก "ติดตั้งแอป" หรือ "Add to Home Screen"');
    }
}

function closeIosPrompt() {
    iosPrompt.style.display = 'none';
}

// --- ฟังก์ชันอื่นๆ ของเว็บ ---
function togglePassword(icon) {
    /* ...โค้ดเดิม... */
    let input = document.getElementById('passwordInput');
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
