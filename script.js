document.addEventListener('DOMContentLoaded', () => {
    
    const installContainer = document.getElementById('installContainer');
    const installButton = document.getElementById('installPWA');
    const popup = document.getElementById('installInstructions');
    let deferredPrompt; 

    // ตรวจสอบว่าเปิดผ่าน App หรือยัง
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- 1. การแสดงผลปุ่ม ---
    if (!isInStandaloneMode()) {
        // ถ้ายังไม่ติดตั้ง -> เพิ่ม Class 'visible'
        // CSS จะจัดการเองว่าบน Desktop เป็น Inline, บน Mobile เป็น Fixed Bottom
        if (installContainer) {
            installContainer.classList.add('visible');
        }
    } else {
        // ถ้าติดตั้งแล้ว -> ลบ Class (ซ่อนปุ่ม)
        if (installContainer) {
            installContainer.classList.remove('visible');
        }
    }

    // --- 2. เก็บ Event (เฉพาะ Android/Chrome Desktop) ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // ปุ่มแสดงอยู่แล้วจาก Logic ข้อ 1 ไม่ต้องทำอะไรเพิ่ม
    });

    // --- 3. เมื่อคลิกปุ่ม ---
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                // กรณี A: เครื่องรองรับ Auto Install (Android, Chrome Desktop)
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        installContainer.classList.remove('visible');
                    }
                    deferredPrompt = null;
                });
            } else {
                // กรณี B: เครื่องไม่รองรับ Auto (iOS Safari, iOS Chrome, Firefox)
                // ให้แสดง Popup คำแนะนำแทนเสมอ
                if (popup) {
                    popup.style.display = 'block';
                }
            }
        });
    }
});

// Global functions
function closePopup() {
    const popup = document.getElementById('installInstructions');
    if (popup) popup.style.display = 'none';
}

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
