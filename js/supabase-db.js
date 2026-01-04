/* =========================================
   2. Supabase Connection (ตัวเชื่อมฐานข้อมูล)
   ========================================= */

// ตัวแปร Global สำหรับเรียกใช้ Database ทั่วทั้งแอป
let sysDB = null;

(function initSupabase() {
    // 1. ตรวจสอบว่าโหลด Library มาหรือยัง
    if (typeof supabase === 'undefined') {
        console.error('❌ Critical Error: Supabase SDK not found. Please add the CDN script in your HTML head.');
        alert('ระบบไม่สามารถโหลดฐานข้อมูลได้ กรุณาตรวจสอบอินเทอร์เน็ต');
        return;
    }

    // 2. ตรวจสอบ Config
    if (typeof APP_CONFIG === 'undefined') {
        console.error('❌ Critical Error: Config not found. Please load js/config.js before this file.');
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

// ฟังก์ชันช่วยเหลือ: ตรวจสอบว่า Login อยู่ไหม? (ใช้บ่อย)
async function checkAuthRedirect() {
    if (!sysDB) return;
    const { data: { user } } = await sysDB.auth.getUser();
    if (!user) {
        // ถ้าไม่มี User ให้เด้งไปหน้า Login ทันที
        window.location.href = 'teacher-login.html';
    }
    return user;
}
