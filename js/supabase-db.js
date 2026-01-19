/* =========================================
   2. Supabase Connection (ตัวเชื่อมฐานข้อมูล)
   ========================================= */

// กำหนดให้เป็นตัวแปร Global ที่ผูกกับ window เพื่อให้ไฟล์อื่นเรียกใช้ได้แน่นอน
window.sysDB = null;

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
        // กำหนดค่าลงใน window.sysDB
        window.sysDB = supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY);
        console.log('✅ Database Connected Successfully');
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    }
})();

// ฟังก์ชันช่วยเหลือ: ตรวจสอบสถานะ Login
async function checkAuthRedirect() {
    const db = window.sysDB;
    if (!db) return null;
    try {
        const { data: { user } } = await db.auth.getUser();
        if (!user) {
            window.location.href = 'teacher-login.html';
        }
        return user;
    } catch (e) {
        return null;
    }
}
