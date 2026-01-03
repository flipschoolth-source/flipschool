document.addEventListener('DOMContentLoaded', () => {
    
    // อ้างอิง Element
    const installContainer = document.getElementById('installContainer');
    const installButton = document.getElementById('installPWA');
    const popup = document.getElementById('installInstructions');
    let deferredPrompt; // สำหรับ Android

    // ฟังก์ชันตรวจสอบว่าเปิดผ่าน App แล้วหรือยัง
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- 1. ตรวจสอบสถานะการติดตั้ง ---
    if (!isInStandaloneMode()) {
        // ถ้า "ไม่ได้" เปิดผ่านแอป -> แสดงแถบปุ่มติดตั้ง
        if (installContainer) {
            installContainer.style.display = 'flex';
        }
    } else {
        // ถ้าเปิดผ่านแอปแล้ว -> ซ่อนแถบปุ่ม
        if (installContainer) {
            installContainer.style.display = 'none';
        }
    }

    // --- 2. เก็บ Event ของ Android ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // ไม่ต้องทำอะไรเพิ่ม เพราะปุ่มแสดงอยู่แล้วตาม Logic ข้อ 1
    });

    // --- 3. เมื่อกดปุ่มติดตั้ง ---
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                // กรณี Android/Chrome: ติดตั้งอัตโนมัติ
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        installContainer.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            } else {
                // กรณี iOS/Safari: แสดง Popup คำแนะนำ
                if (popup) {
                    popup.style.display = 'block';
                }
            }
        });
    }
});

// ฟังก์ชันปิด Popup
function closePopup() {
    const popup = document.getElementById('installInstructions');
    if (popup) {
        popup.style.display = 'none';
    }
}

// ฟังก์ชันเปิด/ปิดรหัสผ่าน
function togglePassword(icon) {
    let input = document.getElementById('passwordInput');
    if (!input) {
        // กรณีหา ID ไม่เจอ ลองหาจากพี่น้องข้างๆ (เผื่อหน้า Register)
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
