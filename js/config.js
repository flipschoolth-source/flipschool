/* =========================================
   1. การตั้งค่าระบบ (Configuration)
   ========================================= */

const APP_CONFIG = {
    // 1. Supabase Settings (หัวใจสำคัญ)
    SUPABASE_URL: 'https://hznmvaxjlgjnrvtjosdt.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bm12YXhqbGdqbnJ2dGpvc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjQwMzMsImV4cCI6MjA4MjU0MDAzM30.o5W0oP8mnMOs9DWcvGgZ9F7E1EdysBuUu807UKdbqnE',

    // 2. ข้อมูลแอปพลิเคชัน
    APP_NAME: 'FlipSchool',
    APP_VERSION: '1.0.0 (Beta)',

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
        PRIMARY: '#4361ee',
        SECONDARY: '#4cc9f0'
    }
};

// ล็อกค่าไว้ห้ามแก้ไขระหว่างทำงาน (เพื่อความปลอดภัยของโค้ด)
Object.freeze(APP_CONFIG);

console.log(`%c ${APP_CONFIG.APP_NAME} Ready `, 'background: #4361ee; color: #fff; border-radius: 3px;');
console.log(`Licensed to: ${APP_CONFIG.OWNER.SCHOOL}`);
