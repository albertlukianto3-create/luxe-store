import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() { return Response.json((await readDB()).products); }

export async function POST(req) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  if (!b.name || !(Number(b.price) > 0)) return Response.json({ error: 'Nama dan harga wajib diisi' }, { status: 400 });
  const db = await readDB();
  const p = { id: crypto.randomUUID().slice(0, 8), name: b.name, category: b.category || 'Umum', description: b.description || '', price: Number(b.price), stock: Math.max(0, parseInt(b.stock) || 0), image: b.image || '' };
  db.products.unshift(p);
  await writeDB(db);
  return Response.json(p);
}
