// ไฟล์: js/config.js
/* =========================================
   1. การตั้งค่าระบบ (Configuration)
   ========================================= */

const APP_CONFIG = {
    // 1. Supabase Settings
    SUPABASE_URL: 'https://hznmvaxjlgjnrvtjosdt.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bm12YXhqbGdqbnJ2dGpvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjQwMzMsImV4cCI6MjA4MjU0MDAzM30.o5W0oP8mnMOs9DWcvGgZ9F7E1EdysBuUu807UKdbqnE',

    // 2. ข้อมูลแอปพลิเคชัน
    APP_NAME: 'FlipSchool',
    APP_SLOGAN: 'นวัตกรรมเพื่อการจัดการเรียนรู้',
    APP_VERSION: '1.0.0 (Beta)',
    FOOTER_TEXT: 'วิจัยและพัฒนานวัตกรรมเพื่อการจัดการเรียนรู้ GLORY Model',
    YEAR: '2026',

    // 3. ข้อมูลผู้พัฒนา / เจ้าของลิขสิทธิ์
    OWNER: {
        NAME: 'ครูไพรัช อินควรชุม',
        POSITION: 'ครูชำนาญการพิเศษ',
        SCHOOL: 'โรงเรียนเทศบาล 1 (ถนนนครนอก)',
        AFFILIATION: 'เทศบาลนครสงขลา',
        PROVINCE: 'สงขลา'
    },

    // 4. ตั้งค่าธีมเริ่มต้น
    THEME: {
        PRIMARY: '#00008B',
        ACCENT: '#FF8C00'
    },

    // รหัสสำหรับเชื่อมต่อระบบล็อกอินด้วย Google
    GOOGLE_CLIENT_ID: '450991822360-2t4h354971l21uhk2c5ticjbh8f30jrf.apps.googleusercontent.com',

    // 5. รายละเอียด GLORY Model (สำหรับ Modal)
    GLORY_DETAILS: {
        HOME: [
            { letter: 'G', title: 'Gamified Mission', desc: 'เรียนรู้ผ่านการทำภารกิจบนเว็บแอปพลิเคชัน สะสมแต้มและระดับคะแนนอย่างสนุกสนาน' }
        ],
        SCHOOL: [
            { letter: 'L', title: 'Lively Brain Boost', desc: 'ขยับกายขยายสมอง เตรียมความพร้อมก่อนเรียน' },
            { letter: 'O', title: 'Operational Learning', desc: 'ลงมือปฏิบัติจริง เน้นกิจกรรมเชิงรุก (Active Learning)' },
            { letter: 'R', title: 'Reflective Summary', desc: 'สะท้อนคิด สรุปองค์ความรู้ด้วยตนเอง' },
            { letter: 'Y', title: 'Yielding Pride', desc: 'สร้างความภาคภูมิใจในผลงานความสำเร็จ' }
        ]
    }
};

// ล็อกค่าไว้ห้ามแก้ไข
Object.freeze(APP_CONFIG);

/**
 * ฟังก์ชันสำหรับอัปเดตข้อมูล UI พื้นฐาน (Logo, Slogan, Footer) ทั่วทั้งระบบ
 */
function initAppUI() {
    // อัปเดต Title ของแท็บเว็บ
    if (document.title.includes("FlipSchool") || document.title === "") {
        document.title = `${APP_CONFIG.APP_NAME} - ${APP_CONFIG.APP_SLOGAN}`;
    }
    
    // อัปเดตชื่อแบรนด์ใน Navbar (.brand-name)
    const brandElements = document.querySelectorAll('.brand-name, .nav-brand');
    brandElements.forEach(el => {
        el.innerHTML = `Flip<span>School</span>`;
    });
    
    // อัปเดตสโลแกน (.slogan)
    const sloganElements = document.querySelectorAll('.slogan, .nav-slogan');
    sloganElements.forEach(el => {
        el.innerText = APP_CONFIG.APP_SLOGAN;
    });

    // อัปเดต Footer ทั่วทั้งระบบ (.footer หรือ .footer-display-text)
    const footerElements = document.querySelectorAll('.footer, .footer-display-text');
    footerElements.forEach(el => {
        const year = APP_CONFIG.YEAR || new Date().getFullYear();
        const appName = APP_CONFIG.APP_NAME || 'FlipSchool';
        const slogan = APP_CONFIG.APP_SLOGAN || '';
        const fText = APP_CONFIG.FOOTER_TEXT || '';
        const owner = APP_CONFIG.OWNER || {};
        
        let html = `&copy; ${year} ${appName} - ${slogan}`;
        
        if (fText) {
            html += `<br><span style="opacity: 0.85;">${fText}</span>`;
        }
        
        if (owner.NAME) {
            html += `<br><span style="font-size: 0.85em; opacity: 0.7; display: inline-block; margin-top: 5px; line-height: 1.6;">
                     ผู้พัฒนา / เจ้าของลิขสิทธิ์: ${owner.NAME} ${owner.POSITION}<br>
                     ${owner.SCHOOL} สังกัด${owner.AFFILIATION} จ.${owner.PROVINCE}
                     </span>`;
        }
        
        el.innerHTML = html;
    });
}

console.log(`%c ${APP_CONFIG.APP_NAME} Config Loaded `, `background: ${APP_CONFIG.THEME.PRIMARY}; color: #fff; border-radius: 3px; padding: 2px 5px;`);

/* ==============================================================
   2. ระบบ Pull-to-Refresh (ดึงจอลงเพื่อรีโหลด) สำหรับมือถือ
   ============================================================== */
(function() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let ptrIndicator = null;

    function createIndicator() {
        if (document.getElementById('ptr-indicator')) return;
        ptrIndicator = document.createElement('div');
        ptrIndicator.id = 'ptr-indicator';
        ptrIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        ptrIndicator.style.cssText = `
            position: fixed; top: -60px; left: 50%; transform: translateX(-50%);
            width: 40px; height: 40px; background: white; border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: flex;
            align-items: center; justify-content: center; z-index: 99999;
            color: ${APP_CONFIG.THEME.PRIMARY}; font-size: 18px; 
            transition: top 0.2s ease, transform 0.2s ease-out;
        `;
        document.body.appendChild(ptrIndicator);
    }

    function getScrollTop() {
        return window.scrollY || document.documentElement.scrollTop;
    }

    window.addEventListener('touchstart', function(e) {
        if (getScrollTop() <= 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
            createIndicator();
        } else {
            isPulling = false;
        }
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        currentY = e.touches[0].clientY;
        let diffY = currentY - startY;

        if (diffY > 0 && getScrollTop() <= 0) {
            let pullDistance = Math.min(diffY * 0.4, 90); 
            
            if (ptrIndicator) {
                ptrIndicator.style.transition = 'none';
                ptrIndicator.style.top = (pullDistance - 50) + 'px';
                ptrIndicator.style.transform = `translateX(-50%) rotate(${pullDistance * 4}deg)`;
            }
            
            if (e.cancelable && diffY > 10) e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('touchend', function(e) {
        if (!isPulling) return;
        isPulling = false;
        let diffY = currentY - startY;

        if (ptrIndicator) {
            ptrIndicator.style.transition = 'top 0.3s ease, transform 0.3s ease';
            
            if (diffY > 120 && getScrollTop() <= 0) {
                ptrIndicator.style.top = '25px';
                ptrIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                setTimeout(() => { window.location.reload(); }, 300);
            } else {
                ptrIndicator.style.top = '-60px';
                ptrIndicator.style.transform = `translateX(-50%) rotate(0deg)`;
            }
        }
    });
})();

/* ==============================================================
   3. ลงทะเบียน Service Worker สำหรับ PWA
   ============================================================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                // ตรวจสอบการอัปเดต Service Worker
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('พบเวอร์ชันใหม่! กำลังอัปเดต...');
                        }
                    };
                };
            })
            .catch(err => console.error('Service Worker Register Error:', err));
    });
}

// อนุญาตให้ไฟล์อื่นเรียกใช้งานได้ (ถ้ามีการใช้โมดูล)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
