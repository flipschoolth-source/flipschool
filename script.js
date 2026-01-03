document.addEventListener('DOMContentLoaded', () => {
    
    // ตัวแปรต่างๆ
    const installContainer = document.getElementById('installContainer');
    const installButton = document.getElementById('installPWA');
    const popup = document.getElementById('installInstructions');
    let deferredPrompt; // เก็บ event สำหรับ Android

    // ฟังก์ชันตรวจสอบว่าเปิดผ่าน App แล้วหรือยัง (Standalone Mode)
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- LOGIC 1: การแสดงปุ่ม ---
    // ถ้า "ยังไม่ได้เปิดผ่านแอป" ให้แสดงปุ่มเสมอ (ไม่ว่าจะ iOS หรือ Android)
    if (!isInStandaloneMode()) {
        if (installContainer) {
            installContainer.style.display = 'flex';
        }
    } else {
        // ถ้าเปิดผ่านแอปแล้ว ให้ซ่อนปุ่ม
        if (installContainer) {
            installContainer.style.display = 'none';
        }
    }

    // --- LOGIC 2: เก็บ Event สำหรับ Android ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // ปุ่มแสดงอยู่แล้วตาม Logic 1 ไม่ต้องทำอะไรเพิ่ม
    });

    // --- LOGIC 3: การทำงานเมื่อกดปุ่ม ---
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                // CASE A: เครื่องรองรับการติดตั้งอัตโนมัติ (Android / Chrome Desktop)
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        // ถ้าผู้ใช้กดติดตั้ง ให้ซ่อนปุ่มไปเลย
                        installContainer.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            } else {
                // CASE B: เครื่องไม่รองรับ Auto (iOS / Safari / อื่นๆ)
                // ให้แสดง Popup คำแนะนำแทน
                if (popup) {
                    popup.style.display = 'block';
                }
            }
        });
    }
});

// --- ฟังก์ชัน Global ---

// ปิด Popup คำแนะนำ
function closePopup() {
    const popup = document.getElementById('installInstructions');
    if (popup) {
        popup.style.display = 'none';
    }
}

// สลับการแสดงรหัสผ่าน (ใช้ได้ทุกหน้า)
function togglePassword(icon) {
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
