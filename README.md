# Luxe Store

1. `npm install`
2. `cp .env.example .env.local` lalu isi ADMIN_PASSWORD, AUTH_SECRET, OPENROUTER_API_KEY
3. `npm run dev` → toko di http://localhost:3000, admin di http://localhost:3000/admin

Data tersimpan di `data/db.json` (otomatis dibuat). Cocok untuk VPS/lokal; untuk Vercel/serverless
ganti `lib/db.js` dengan database (Supabase, Neon, PlanetScale, dsb).
