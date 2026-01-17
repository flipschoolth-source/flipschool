import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. จัดการ Preflight (แก้ปัญหา 200 Preflight ที่คุณเจอ)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    // ตรวจสอบ Secret (ถ้าไม่มีจะแจ้ง Error ชัดเจน ไม่ปล่อยให้พังเป็น 500)
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Supabase Secrets" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. เรียก Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `สร้างบทเรียนเป็นรูปแบบ JSON เท่านั้น: ${prompt}` }] }],
          generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.7 
          }
        }),
      }
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Gemini API Error: ${errorDetail}`);
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawJson) throw new Error("Gemini ไม่ส่งข้อมูลรูปแบบ JSON กลับมา");

    const lesson = JSON.parse(rawJson);
    
    // 3. ส่ง HTML กลับ (ใช้ฟังก์ชัน buildMissionHTML เดิม)
    const html = `
      <div style="font-family:'Sarabun',sans-serif; padding:20px;">
        <h2 style="color:#7c3aed;">${lesson.title || 'บทเรียนใหม่'}</h2>
        <p><strong>ระดับ:</strong> ${lesson.level || '-'}</p>
        <hr>
        <h3>เนื้อหา</h3>
        <p>${lesson.content || 'ไม่มีเนื้อหา'}</p>
      </div>
    `;

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // ส่ง Error ออกไปให้หน้าเว็บเห็นชัดๆ
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // ส่งเป็น 200 เพื่อให้หน้าเว็บอ่านข้อความ Error ได้
    });
  }
});
