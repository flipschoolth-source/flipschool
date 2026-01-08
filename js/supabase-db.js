/* =========================================
   2. Supabase Connection (ตัวเชื่อมฐานข้อมูล)
   ========================================= */

// ตัวแปร Global สำหรับเรียกใช้ Database ทั่วทั้งแอป
let sysDB = null;

(function initSupabase() {
    // 1. ตรวจสอบว่าโหลด Library มาหรือยัง
    if (typeof supabase === 'undefined') {
        console.error('❌ Critical Error: Supabase SDK not found.');
        return;
    }

    // 2. ตรวจสอบ Config
    if (typeof APP_CONFIG === 'undefined') {
        console.error('❌ Critical Error: Config not found.');
        return;
    }

    // 3. เริ่มเชื่อมต่อ
    try {
        sysDB = supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY);
        console.log('✅ Database Connected Successfully');
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    }
})();

// ฟังก์ชันช่วยเหลือ: ตรวจสอบสถานะ Login (ถ้าไม่ได้ Login ให้ไปหน้าเข้าสู่ระบบ)
async function checkAuthRedirect() {
    if (!sysDB) return null;
    try {
        const { data: { user } } = await sysDB.auth.getUser();
        if (!user) {
            window.location.href = 'teacher-login.html';
        }
        return user;
    } catch (e) {
        return null;
    }
}
