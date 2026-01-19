#!/bin/sh

# สร้างโฟลเดอร์ js ถ้ายังไม่มี
mkdir -p js

# เขียนค่าจากระบบ Hosting ลงในไฟล์ js/env-config.js
echo "window._env_ = {
  SUPABASE_URL: '$SUPABASE_URL',
  SUPABASE_KEY: '$SUPABASE_KEY'
};" > js/env-config.js

echo "✅ Generated js/env-config.js successfully"
