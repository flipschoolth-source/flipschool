/* =========================================
   2. Supabase Connection (ตัวเชื่อมฐานข้อมูล)
   ========================================= */

// กำหนดให้เป็นตัวแปร Global ที่ผูกกับ window เพื่อให้ไฟล์อื่นเรียกใช้ได้แน่นอน
window.sysDB = null;

/**
 * ฟังก์ชันเริ่มต้นการเชื่อมต่อ Supabase
 * จะถูกเรียกโดยอัตโนมัติเมื่อโหลดไฟล์นี้
 */
window.initSupabase = function() {
    // 1. ตรวจสอบว่าโหลด Library (SDK) มาหรือยัง
    if (typeof supabase === 'undefined') {
        console.warn('⚠️ Supabase SDK not found yet, retrying...');
        return false;
    }

    // 2. ตรวจสอบ Config จาก js/config.js
    if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.SUPABASE_URL) {
        console.error('❌ Critical Error: APP_CONFIG or Supabase URL not found.');
        return false;
    }

    // 3. เริ่มเชื่อมต่อ
    try {
        if (!window.sysDB) {
            window.sysDB = supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY);
            console.log('✅ Database Connected Successfully');
        }
        return true;
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        return false;
    }
};

// รันฟังก์ชันทันที
initSupabase();

// ฟังก์ชันช่วยเหลือ: ตรวจสอบสถานะ Login
async function checkAuthRedirect() {
    const db = window.sysDB;
    if (!db) {
        console.error('❌ sysDB is not initialized');
        return null;
    }
    try {
        const { data: { user } } = await db.auth.getUser();
        if (!user) {
            window.location.href = 'teacher-login.html';
        }
        return user;
    } catch (e) {
        console.error('Auth Check Error:', e);
        return null;
    }
}
