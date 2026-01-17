import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `จงสร้างบทเรียนเรื่อง: ${prompt} โดยเขียนเป็น HTML ที่สวยงาม ใช้ฟอนต์ Sarabun และจัดรูปแบบให้น่าอ่านสำหรับเด็ก` }] }],
        }),
      }
    );

    const result = await response.json();
    let htmlContent = result.candidates?.[0]?.content?.parts?.[0]?.text || "<h3>ไม่สามารถสร้างเนื้อหาได้</h3>";
    
    // ลบสัญลักษณ์ ```html ที่ AI มักแถมมาออกเพื่อให้แสดงผลได้ทันที
    htmlContent = htmlContent.replace(/```html|```/g, "");

    return new Response(JSON.stringify({ html: htmlContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, 
    });
  }
});
