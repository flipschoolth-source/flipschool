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
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // เปลี่ยนมาใช้รุ่น gemini-1.5-flash เพื่อความเสถียรและความเร็ว
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `คุณคือครูประถม เขียนเนื้อหาบทเรียนสำหรับเด็ก หัวข้อ: ${prompt} โครงสร้าง: ชื่อบทเรียน, คำอธิบาย, เนื้อหา, กิจกรรม, คำถามท้ายบท 3 ข้อ ตอบเป็นข้อความล้วน ไม่ใช้ markdown` }]
          }]
        }),
      }
    );

    if (!geminiRes.ok) throw new Error("Gemini API error: " + await geminiRes.text());

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "ไม่ได้รับเนื้อหา";

    const html = `
      <!DOCTYPE html>
      <html lang="th">
      <head><meta charset="UTF-8"><style>body{font-family:Sarabun,sans-serif;padding:20px;line-height:1.7}h1{color:#7c3aed}h2{margin-top:20px}</style></head>
      <body>
      ${rawText.replace(/ชื่อบทเรียน:/g, "<h1>📘 ชื่อบทเรียน</h1>").replace(/คำอธิบาย:/g, "<h2>📝 คำอธิบาย</h2>").replace(/เนื้อหา:/g, "<h2>📚 เนื้อหา</h2>").replace(/กิจกรรม:/g, "<h2>🎯 กิจกรรม</h2>").replace(/คำถามท้ายบท:/g, "<h2>❓ คำถามท้ายบท</h2>").replace(/\n/g, "<br>")}
      </body></html>`;

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ html: `<div style="color:red;font-family:Sarabun"><h3>เกิดข้อผิดพลาด</h3><p>${e.message}</p></div>` }), { headers: corsHeaders });
  }
});
