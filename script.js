/* script.js - Improved Version */

/**
 * --------------------------------------------------------------------------
 * 1. PASSWORD TOGGLE LOGIC (ระบบสลับดูรหัสผ่าน)
 * --------------------------------------------------------------------------
 * ใช้สำหรับสลับ type ของ input ระหว่าง 'password' และ 'text'
 * รองรับการใช้งานหลายช่องในหน้าเดียวกัน (เช่น หน้าลงทะเบียน)
 *
 * @param {HTMLElement} icon - ตัวไอคอนรูปตาที่ถูกกด (this)
 * @param {string} inputId - (Optional) ID ของช่อง input ที่ต้องการสลับ
 * ถ้าไม่ระบุ จะค้นหา ID 'passwordInput' เป็นค่าเริ่มต้น
 */
function togglePassword(icon, inputId) {
    // กำหนด ID เป้าหมาย: ถ้าส่งค่ามาให้ใช้ค่านั้น ถ้าไม่ส่งให้ใช้ 'passwordInput'
    const targetId = inputId || 'passwordInput';
    const input = document.getElementById(targetId);

    // ถ้าหา input ไม่เจอ ให้จบการทำงานทันทีเพื่อป้องกัน Error
    if (!input) return;

    if (input.type === "password") {
        // เปลี่ยนเป็น text เพื่อแสดงรหัสผ่าน
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash"); // เปลี่ยนไอคอนเป็นรูปตาที่มีขีดฆ่า
    } else {
        // เปลี่ยนกลับเป็น password เพื่อซ่อน
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye"); // เปลี่ยนไอคอนกลับเป็นรูปตาปกติ
    }
}

/**
 * ฟังก์ชันปิด Popup แนะนำการติดตั้งสำหรับ iOS
 */
function closeIosPopup() {
    const iosPopup = document.getElementById('iosInstallPopup');
    if (iosPopup) {
        // ใส่ Effect เลื่อนลงก่อนปิด (ถ้ามี CSS animation)
        iosPopup.style.opacity = '0';
        iosPopup.style.bottom = '-100px';
        setTimeout(() => {
            iosPopup.style.display = 'none';
        }, 500); // รอ animation จบ
    }
}


/**
 * --------------------------------------------------------------------------
 * 2. PWA INSTALLATION LOGIC (ระบบติดตั้งแอป)
 * --------------------------------------------------------------------------
 * ทำงานเมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
 */
document.addEventListener('DOMContentLoaded', () => {
    const installButton = document.getElementById('installPWA');
    const iosPopup = document.getElementById('iosInstallPopup');

    // ตรวจสอบว่ามีปุ่มหรือ Popup อยู่ในหน้านั้นหรือไม่ (ถ้าไม่มีก็ไม่ต้องทำต่อ)
    if (!installButton && !iosPopup) return;

    // --- Helper Functions ---

    // ตรวจสอบว่าเป็นอุปกรณ์ iOS หรือไม่
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    };

    // ตรวจสอบว่าเปิดในโหมด App (Standalone) แล้วหรือยัง
    const isInStandaloneMode = () => {
        return ('standalone' in window.navigator && window.navigator.standalone) ||
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // --- Logic A: สำหรับ Android / Desktop Chrome ---
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // ป้องกัน Chrome แสดงแถบติดตั้งอัตโนมัติด้านล่าง (เราจะใช้ปุ่มของเราเอง)
        e.preventDefault();
        deferredPrompt = e;

        // เงื่อนไข: ต้องไม่ใช่ iOS และยังไม่ได้ติดตั้งแอป
        if (!isIos() && !isInStandaloneMode() && installButton) {
            installButton.style.display = 'inline-block'; // แสดงปุ่มติดตั้ง
            console.log('PWA: Ready to install on Android/Desktop');
        }
    });

    if (installButton) {
        installButton.addEventListener('click', () => {
            // ซ่อนปุ่มทันทีที่กด
            installButton.style.display = 'none';

            if (deferredPrompt) {
                // แสดง Prompt ของ Browser
                deferredPrompt.prompt();

                // ตรวจสอบผลลัพธ์ว่าผู้ใช้กด Install หรือ Cancel
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA: User accepted the install prompt');
                    } else {
                        console.log('PWA: User dismissed the install prompt');
                    }
                    deferredPrompt = null; // เคลียร์ค่า
                });
            }
        });
    }

    // --- Logic B: สำหรับ iOS (แสดง Popup คำแนะนำ) ---
    // เงื่อนไข: เป็น iOS, ยังไม่ได้ติดตั้ง, และมี HTML Popup อยู่ในหน้าเว็บ
    if (isIos() && !isInStandaloneMode() && iosPopup) {
        console.log('PWA: Detected iOS device not in standalone mode');
        
        // ตั้งเวลาหน่วง 3 วินาที เพื่อให้ผู้ใช้เห็นเนื้อหาเว็บก่อนค่อยเด้งเตือน
        setTimeout(() => {
            iosPopup.style.display = 'block';
        }, 3000);
    }

    // --- Analytics / Logging ---
    window.addEventListener('appinstalled', () => {
        console.log('PWA: Application installed successfully');
        // ถ้าต้องการซ่อนปุ่มหรือ Popup ทันทีที่ติดตั้งเสร็จ
        if (installButton) installButton.style.display = 'none';
        if (iosPopup) iosPopup.style.display = 'none';
    });
});
