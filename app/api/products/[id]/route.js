import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_, { params }) {
  const p = (await readDB()).products.find((x) => x.id === params.id);
  return p ? Response.json(p) : Response.json({ error: 'Tidak ditemukan' }, { status: 404 });
}
export async function PUT(req, { params }) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  const db = await readDB();
  const i = db.products.findIndex((x) => x.id === params.id);
  if (i < 0) return Response.json({ error: 'Tidak ditemukan' }, { status: 404 });
  db.products[i] = { ...db.products[i], name: b.name, category: b.category || 'Umum', description: b.description || '', image: b.image || '', price: Number(b.price), stock: Math.max(0, parseInt(b.stock) || 0) };
  await writeDB(db);
  return Response.json(db.products[i]);
}
export async function DELETE(_, { params }) {
  if (!isAdmin()) return deny();
  const db = await readDB();
  db.products = db.products.filter((x) => x.id !== params.id);
  await writeDB(db);
  return Response.json({ ok: true });
}
