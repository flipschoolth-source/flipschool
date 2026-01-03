document.addEventListener('DOMContentLoaded', () => {

    // --- ส่วนจัดการปุ่มติดตั้ง (Logic จาก TAS-SPB เป๊ะๆ) ---
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    const iosPrompt = document.getElementById('iosPrompt');

    // ตรวจสอบ Standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // ตรวจสอบ iOS (Regex จาก TAS-SPB)
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (!isStandalone) {
        // Logic สำหรับ Android / Chrome Desktop
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if(installBtn) installBtn.style.display = 'flex';
        });

        // Logic สำหรับ iOS (TAS-SPB บังคับโชว์เลยถ้าเป็น iOS)
        if (isIOS) {
            if(installBtn) installBtn.style.display = 'flex';
        }
    }

    // ฟังก์ชันติดตั้ง (เรียกจาก onclick ใน HTML)
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
            alert('กรุณากดเมนูของเบราว์เซอร์แล้วเลือก "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)');
        }
    };

    // ฟังก์ชันปิด Popup iOS
    window.closeIosPrompt = function() {
        if(iosPrompt) iosPrompt.style.display = 'none';
    };
});

// --- ฟังก์ชัน Toggle Password เดิม (คงไว้สำหรับการใช้งานอื่นๆ) ---
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
