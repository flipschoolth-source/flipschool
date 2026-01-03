document.addEventListener('DOMContentLoaded', () => {

    const installBtn = document.getElementById('installBtn');
    const iosPrompt = document.getElementById('iosPrompt');
    let deferredPrompt;

    // ตรวจสอบว่าเป็น Standalone หรือยัง
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // ตรวจสอบ iOS
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (!isStandalone) {
        // 1. Android / PC: รอ Event beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if(installBtn) installBtn.style.display = 'flex';
        });

        // 2. iOS: บังคับแสดงปุ่มเลย (เพราะไม่มี Event beforeinstallprompt)
        if (isIOS) {
            if(installBtn) installBtn.style.display = 'flex';
        }
    }

    // ฟังก์ชันติดตั้ง (เรียกจากปุ่ม)
    window.installApp = function() {
        if (isIOS) {
            // iOS: เปิด Popup (เปลี่ยน display เป็น flex)
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
            alert('กรุณากดเมนูของเบราว์เซอร์แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"');
        }
    };

    // ฟังก์ชันปิด Popup
    window.closeIosPrompt = function() {
        if(iosPrompt) iosPrompt.style.display = 'none';
    };
});

// ฟังก์ชันอื่นๆ (Toggle Password)
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
