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
        // ป้องกันไม่ให้ Browser แสดงแถบติดตั้งอัตโนมัติ (เราจะใช้ปุ่มของเราเอง)
        e.preventDefault();
        deferredPrompt = e;
        
        // แสดงปุ่มติดตั้ง (ถ้ายังไม่ได้ติดตั้ง)
        if (installButton) {
            installButton.style.display = 'inline-block';
        }
    });

    // 2. Logic สำหรับ iOS (แสดงปุ่มเสมอถ้ายังไม่ได้ติดตั้ง และเป็นอุปกรณ์ iOS)
    if (isIos() && !isInStandaloneMode()) {
        if (installButton) {
            installButton.style.display = 'inline-block';
        }
    }

    // เมื่อกดปุ่ม "ติดตั้งแอป"
    if (installButton) {
        installButton.addEventListener('click', (e) => {
            if (isIos()) {
                // ถ้าเป็น iOS -> เปิด Popup สอนวิธีติดตั้ง
                if (iosPopup) {
                    iosPopup.style.display = 'block';
                }
            } else if (deferredPrompt) {
                // ถ้าเป็น Android/PC -> เรียก Prompt ของระบบ
                deferredPrompt.prompt();
                
                // รอผลลัพธ์ว่าผู้ใช้กดติดตั้งหรือไม่
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the PWA install');
                    } else {
                        console.log('User dismissed the PWA install');
                    }
                    deferredPrompt = null;
                });
            } else {
                // กรณีอื่นๆ หรือหา event ไม่เจอ
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

// 2. ฟังก์ชันสลับการแสดงรหัสผ่าน (ใช้ในหน้า Login)
function togglePassword(icon) {
    const input = document.getElementById('passwordInput');
    if (input) {
        if (input.type === "password") {
            input.type = "text"; // เปลี่ยนเป็น text เพื่อให้เห็นรหัส
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash"); // เปลี่ยนรูปตาเป็นมีขีดทับ
        } else {
            input.type = "password"; // กลับเป็น password เหมือนเดิม
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye"); // เปลี่ยนรูปตากลับมาปกติ
        }
    }
}
