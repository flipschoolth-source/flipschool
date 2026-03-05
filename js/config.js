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
        POSITION: 'ครูชำนาญการ',
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

/* ==============================================================
   🌟 2. ระบบ Transition ความลื่นไหล (Native SPA Feel) 🌟
   ทำให้เปลี่ยนหน้าได้โดย Navbar และ Footer ไม่กระพริบ
   ============================================================== */
(function enableSmoothTransitions() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. เปิดใช้งาน Cross-Document View Transitions (รองรับ Chrome/Edge) */
        @view-transition { navigation: auto; }
        
        /* 2. ล็อก Navbar และ Footer ให้อยู่กับที่ (ไม่กระพริบตอนโหลด) */
        nav, #mainNav, .nav-clean, .nav-gradient { view-transition-name: main-navbar; }
        .footer, footer { view-transition-name: main-footer; }
        
        /* 3. ทำให้เนื้อหาตรงกลางสไลด์เปลี่ยนไปมาเหมือนแอปพลิเคชัน */
        main, .main-container { view-transition-name: main-content; }
        
        ::view-transition-old(main-content) {
            animation: fade-out 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        ::view-transition-new(main-content) {
            animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-15px); }
        }

        /* Fallback Animation สำหรับเบราว์เซอร์รุ่นเก่า */
        body { animation: globalFadeIn 0.4s ease-out forwards; }
        @keyframes globalFadeIn { from { opacity: 0; } to { opacity: 1; } }
    `;
    document.head.appendChild(style);
})();

/* ==============================================================
   3. ฟังก์ชันสำหรับอัปเดตข้อมูล UI พื้นฐานให้เหมือนกันทุกหน้า
   ============================================================== */
function initAppUI() {
    // อัปเดต Title ของแท็บเว็บ
    if (document.title.includes("FlipSchool") || document.title === "") {
        document.title = `${APP_CONFIG.APP_NAME} - ${APP_CONFIG.APP_SLOGAN}`;
    }
    
    // --- 🌟 ยูนิฟาย Navbar ให้โลโก้เป็นมาตรฐานเดียวกัน 🌟 ---
    const brandElements = document.querySelectorAll('.brand-name, .nav-brand');
    brandElements.forEach(el => {
        // ใช้ inline style ผสมเพื่อให้โครงสร้างดูแข็งแรงและไม่เพี้ยนไม่ว่าไฟล์นั้นจะใช้ CSS/Tailwind แบบไหน
        el.innerHTML = `Flip<span style="color: var(--accent, #FF8C00);">School</span>`;
        el.style.fontFamily = "'Kanit', sans-serif";
    });
    
    const sloganElements = document.querySelectorAll('.slogan, .nav-slogan, .brand-slogan, .app-slogan-label');
    sloganElements.forEach(el => {
        el.innerText = APP_CONFIG.APP_SLOGAN;
    });

    // ปรับ Navbar เป็น Theme สว่าง(ขาว) อัตโนมัติในหน้าที่เรียกใช้
    const navs = document.querySelectorAll('nav.nav-clean, nav#mainNav');
    navs.forEach(nav => {
        nav.style.backgroundColor = 'white';
        nav.style.borderBottom = '1px solid #f1f5f9';
        nav.style.boxShadow = '0 4px 20px rgba(0,0,80,0.04)';
    });

    // --- 🌟 ยูนิฟาย Footer ให้เป็น 2 บรรทัด (สวยงามและขนาดเท่ากันทุกหน้า) 🌟 ---
    const footerElements = document.querySelectorAll('.footer, .footer-display-text');
    footerElements.forEach(el => {
        const year = APP_CONFIG.YEAR || new Date().getFullYear();
        const appName = APP_CONFIG.APP_NAME || 'FlipSchool';
        const slogan = APP_CONFIG.APP_SLOGAN || '';
        const fText = APP_CONFIG.FOOTER_TEXT || '';
        const owner = APP_CONFIG.OWNER || {};
        
        let html = `&copy; ${year} ${appName} - ${slogan} | ${fText}`;
        if (owner.NAME) {
            html += `<br><span style="font-size: 0.9em; opacity: 0.75; display: inline-block; margin-top: 5px;">
                     ผู้พัฒนา / เจ้าของลิขสิทธิ์: ${owner.NAME} ${owner.POSITION} ${owner.SCHOOL} สังกัด${owner.AFFILIATION} จ.${owner.PROVINCE}
                     </span>`;
        }
        
        el.innerHTML = html;
        
        // บังคับการจัดรูปแบบ Footer ให้มาตรฐานเป๊ะๆ
        el.style.backgroundColor = 'white';
        el.style.borderTop = '1px solid #f1f5f9';
        el.style.padding = '25px 20px';
        el.style.marginTop = 'auto';
        el.style.color = '#a4b0be';
        el.style.textAlign = 'center';
        el.style.fontSize = '13px';
        el.style.fontFamily = "'Sarabun', sans-serif";
        el.style.lineHeight = '1.6';
        el.style.width = '100%';
    });
}

console.log(`%c ${APP_CONFIG.APP_NAME} Config & Smooth Transition Loaded `, `background: ${APP_CONFIG.THEME.PRIMARY}; color: #fff; border-radius: 3px; padding: 2px 5px;`);

/* ==============================================================
   4. ระบบ Pull-to-Refresh (ดึงจอลงเพื่อรีโหลด) สำหรับมือถือ
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

    function getScrollTop() { return window.scrollY || document.documentElement.scrollTop; }

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

// อนุญาตให้ไฟล์อื่นเรียกใช้งานได้
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
