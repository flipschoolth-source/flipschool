/* =========================================
   1. การตั้งค่าระบบ (Configuration)
   ========================================= */

const APP_CONFIG = {
    // 1. Supabase Settings - ดึงค่าจาก Environment Variables
    // หากไม่มีการกำหนดค่าผ่านระบบ Server ให้ใส่ค่าว่างไว้เพื่อความปลอดภัย
    SUPABASE_URL: window._env_?.SUPABASE_URL || '',
    SUPABASE_KEY: window._env_?.SUPABASE_KEY || '',

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

// ฟังก์ชันสำหรับอัปเดตข้อมูล UI พื้นฐาน (Logo, Slogan, Footer) ทั่วทั้งระบบ
function initAppUI() {
    // อัปเดต Title ของแท็บเว็บ
    if (document.title.includes("FlipSchool")) {
        document.title = `${APP_CONFIG.APP_NAME} - GLORY Model`;
    }
    
    // อัปเดตชื่อแบรนด์ใน Navbar
    const brandElements = document.querySelectorAll('.brand-name');
    brandElements.forEach(el => {
        el.innerHTML = `Flip<span>School</span>`;
    });
    
    // อัปเดตสโลแกน
    const sloganElements = document.querySelectorAll('.slogan');
    sloganElements.forEach(el => {
        el.innerText = APP_CONFIG.APP_SLOGAN;
    });

    // อัปเดต Footer
    const footerElements = document.querySelectorAll('.footer');
    footerElements.forEach(el => {
        el.innerHTML = `&copy; ${APP_CONFIG.YEAR} ${APP_CONFIG.APP_NAME}. ${APP_CONFIG.FOOTER_TEXT}`;
    });
}

console.log(`%c ${APP_CONFIG.APP_NAME} Ready `, 'background: #00008B; color: #fff; border-radius: 3px;');

// ==============================================================
// ระบบ Pull-to-Refresh (ดึงจอลงเพื่อรีโหลด) สำหรับมือถือทุกหน้า
// ==============================================================
(function() {
    // 1. ตรวจสอบให้ทำงานเฉพาะบนมือถือและแท็บเล็ตเท่านั้น
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let ptrIndicator = null;

    // 2. ฟังก์ชันสร้างไอคอนโหลดกลมๆ (เหมือนแอปทั่วไป)
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
            color: var(--primary-light, #0052D4); font-size: 18px; 
            transition: top 0.2s ease, transform 0.2s ease-out;
        `;
        document.body.appendChild(ptrIndicator);
    }

    // 3. ฟังก์ชันเช็คว่าหน้าจออยู่ตำแหน่ง "บนสุด" หรือยัง (เพื่อไม่ให้ขัดจังหวะตอนเลื่อนอ่านปกติ)
    function getScrollTop() {
        const windowScroll = window.scrollY || document.documentElement.scrollTop;
        const containerScroll = document.querySelector('.container') ? document.querySelector('.container').scrollTop : 0;
        return Math.max(windowScroll, containerScroll);
    }

    // เริ่มแตะหน้าจอ
    window.addEventListener('touchstart', function(e) {
        if (getScrollTop() <= 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
            createIndicator();
        } else {
            isPulling = false;
        }
    }, { passive: true });

    // กำลังลากนิ้วลง
    window.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        currentY = e.touches[0].clientY;
        let diffY = currentY - startY;

        // ถ้าดึงลงมามากกว่า 0 (ดึงลง) และหน้าจออยู่บนสุด
        if (diffY > 0 && getScrollTop() <= 0) {
            // คำนวณระยะการดึง (ให้หนืดๆ นิดหน่อยเพื่อให้ความรู้สึกเหมือนสปริง)
            let pullDistance = Math.min(diffY * 0.4, 90); 
            
            if (ptrIndicator) {
                ptrIndicator.style.transition = 'none'; // ปิดแอนิเมชันเพื่อให้ตามนิ้วทันที
                ptrIndicator.style.top = (pullDistance - 50) + 'px';
                ptrIndicator.style.transform = `translateX(-50%) rotate(${pullDistance * 4}deg)`;
            }
            
            // ถ้าเบราว์เซอร์ยอม ให้ระงับการเลื่อนหน้าจอกลางคันเพื่อดึงปุ่มนี้ลงมาแทน
            if (e.cancelable && diffY > 10) e.preventDefault();
        }
    }, { passive: false });

    // ปล่อยนิ้ว
    window.addEventListener('touchend', function(e) {
        if (!isPulling) return;
        isPulling = false;
        let diffY = currentY - startY;

        if (ptrIndicator) {
            ptrIndicator.style.transition = 'top 0.3s ease, transform 0.3s ease'; // เปิดแอนิเมชันตอนเด้งกลับ
            
            // ถ้าดึงลงมาลึกเกิน 120px ให้ทำการ "รีโหลดหน้าจอ"
            if (diffY > 120 && getScrollTop() <= 0) {
                ptrIndicator.style.top = '25px'; // ค้างไอคอนไว้บนจอ
                ptrIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // เปลี่ยนเป็นไอคอนโหลด
                
                // สั่งรีโหลดหน้าเว็บ (ดีเลย์ 0.3 วิ ให้เห็นแอนิเมชันหมุนก่อน)
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            } else {
                // ถ้าดึงลงมานิดเดียว เปลี่ยนใจปล่อยนิ้ว ให้เด้งกลับซ่อนไปเหมือนเดิม
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
