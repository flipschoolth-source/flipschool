document.addEventListener('DOMContentLoaded', () => {

    // --- ส่วนจัดการปุ่มติดตั้ง (Logic จาก TAS-SPB) ---
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    const iosPrompt = document.getElementById('iosPrompt');

    // ตรวจสอบ Standalone และ iOS (Regex มาตรฐาน TAS-SPB)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    // ถ้ายังไม่ได้ติดตั้ง
    if (!isStandalone) {
        
        // 1. Android / PC Chrome
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if(installBtn) installBtn.style.display = 'flex';
        });

        // 2. iOS (TAS-SPB สั่งโชว์เลยถ้าเป็น iOS)
        if (isIOS) {
            if(installBtn) installBtn.style.display = 'flex';
        }
    }

    // ฟังก์ชันติดตั้ง (Global Scope เพื่อให้ onclick ใน HTML เรียกได้)
    window.installApp = function() {
        if (isIOS) {
            // iOS: เปิด Popup Overlay
            if(iosPrompt) iosPrompt.style.display = 'flex';
        } else if (deferredPrompt) {
            // Android: เรียก Prompt ระบบ
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    if(installBtn) installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            });
        } else {
            // Fallback
            alert('กรุณากดเมนูของเบราว์เซอร์แล้วเลือก "Add to Home Screen"');
        }
    };

    // ฟังก์ชันปิด Popup
    window.closeIosPrompt = function() {
        if(iosPrompt) iosPrompt.style.display = 'none';
    };

    // --- ฟังก์ชัน Toggle Password ---
    window.togglePassword = function(icon) {
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
    };
});
