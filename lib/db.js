import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'db.json');
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

export async function readDB() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { await writeDB(seed); return structuredClone(seed); }
}
export async function writeDB(data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}
