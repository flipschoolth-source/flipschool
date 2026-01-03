/* script.js */

// ฟังก์ชันสลับการแสดงรหัสผ่าน (ใช้ใน Login และ ลงทะเบียน)
function togglePassword(icon, inputId) {
    // ถ้าไม่ระบุ id ให้ใช้ค่า default เป็น 'passwordInput'
    const targetId = inputId || 'passwordInput';
    const input = document.getElementById(targetId);
    
    if (input && input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else if (input) {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
}

// Logic สำหรับปุ่ม WebApp Install (PWA)
// จะทำงานเมื่อโหลดไฟล์นี้ในหน้า index.html หรือหน้าที่มีปุ่ม #installPWA
document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const installButton = document.getElementById('installPWA');

    if (installButton) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'inline-block'; // แสดงปุ่มเมื่อพร้อมติดตั้ง
            console.log('PWA install prompt ready');
        });

        installButton.addEventListener('click', (e) => {
            installButton.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the PWA install');
                } else {
                    console.log('User dismissed the PWA install');
                }
                deferredPrompt = null;
            });
        });
    }

    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA installed successfully');
    });
});
