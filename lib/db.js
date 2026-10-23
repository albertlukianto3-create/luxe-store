const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const KEY = 'luxe-store-db';

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const seed = {
  products: [
    { id: 'p1', name: 'Jam Tangan Obsidian', category: 'Aksesori', price: 1850000, stock: 12, image: img('photo-1523275335684-37898b6baf30'), description: 'Jam tangan analog dengan casing stainless steel dan kaca safir anti gores.' },
    { id: 'p2', name: 'Headphone Studio Noir', category: 'Elektronik', price: 2400000, stock: 8, image: img('photo-1505740420928-5e560c06d30e'), description: 'Headphone nirkabel dengan peredam bising aktif dan baterai 40 jam.' },
    { id: 'p3', name: 'Tas Kulit Amber', category: 'Fashion', price: 980000, stock: 20, image: img('photo-1548036328-c9fa89d128fa'), description: 'Tas kulit sapi asli, jahitan tangan, muat laptop 14 inci.' },
    { id: 'p4', name: 'Sneakers Midnight', category: 'Fashion', price: 1250000, stock: 15, image: img('photo-1542291026-7eec264c27ff'), description: 'Sneakers ringan dengan sol empuk untuk dipakai seharian.' },
  ],
  orders: [],
  agents: [
    { id: 'a1', name: 'Ayu', role: 'Customer Service', avatar: 'https://i.pravatar.cc/120?img=47', active: true, prompt: 'Gaya bicara super ramah, santai, hangat, pakai sapaan "kak" dan emoji secukupnya.' },
    { id: 'a2', name: 'Dinda', role: 'Customer Service', avatar: 'https://i.pravatar.cc/120?img=32', active: true, prompt: 'Gaya bicara formal, tenang, meyakinkan, dan ringkas. Gunakan sapaan "Bapak/Ibu".' },
  ],
};

async function redis(cmd) {
  if (!URL || !TOKEN) throw new Error('Database belum terhubung (env KV_REST_API_URL / KV_REST_API_TOKEN kosong)');
  const r = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
    cache: 'no-store',
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

export async function readDB() {
  const v = await redis(['GET', KEY]);
  if (v) return JSON.parse(v);
  await writeDB(seed);
  return structuredClone(seed);
}

export async function writeDB(data) {
  await redis(['SET', KEY, JSON.stringify(data)]);
}
