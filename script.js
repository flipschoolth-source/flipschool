document.addEventListener('DOMContentLoaded', () => {
    
    const installContainer = document.getElementById('installContainer');
    const installButton = document.getElementById('installPWA');
    const popup = document.getElementById('installInstructions');
    let deferredPrompt; 

    // ตรวจสอบว่าเปิดผ่านแอปหรือไม่
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator) && (window.navigator.standalone) || 
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- 1. Logic แสดงปุ่ม ---
    if (!isInStandaloneMode()) {
        if (installContainer) {
            // เช็คขนาดหน้าจอเพื่อเลือกวิธีแสดงผล (Flex สำหรับมือถือ, Inline สำหรับ PC)
            if (window.innerWidth <= 768) {
                installContainer.style.display = 'flex'; // แสดงแบบแถบล่าง (Mobile)
            } else {
                installContainer.style.display = 'inline-block'; // แสดงแบบปุ่มปกติ (PC)
            }
        }
    } else {
        if (installContainer) installContainer.style.display = 'none';
    }

    // --- 2. Event Listener สำหรับ Resize (เพื่อให้เปลี่ยนโหมดได้ถ้าหมุนจอ/ย่อจอ) ---
    window.addEventListener('resize', () => {
        if (!isInStandaloneMode() && installContainer) {
             if (window.innerWidth <= 768) {
                installContainer.style.display = 'flex';
            } else {
                installContainer.style.display = 'inline-block';
            }
        }
    });

    // --- 3. เก็บ Event Android ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    // --- 4. คลิกปุ่ม ---
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        installContainer.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            } else {
                // iOS / PC
                if (popup) popup.style.display = 'block';
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
