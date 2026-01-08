/* =========================================
   1. การตั้งค่าระบบ (Configuration)
   ========================================= */

const APP_CONFIG = {
    // 1. Supabase Settings
    SUPABASE_URL: 'https://hznmvaxjlgjnrvtjosdt.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bm12YXhqbGdqbnJ2dGpvc2R0Iiwicm9sZSI6Imh6bm12YXhqbGdqbnJ2dGpvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjQwMzMsImV4cCI6MjA4MjU0MDAzM30.o5W0oP8mnMOs9DWcvGgZ9F7E1EdysBuUu807UKdbqnE',

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
