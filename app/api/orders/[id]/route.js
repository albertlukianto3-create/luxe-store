import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_, { params }) {
  const o = (await readDB()).orders.find((x) => x.id === params.id);
  return o ? Response.json(o) : Response.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
}
export async function PATCH(req, { params }) {
  if (!isAdmin()) return deny();
  const { status } = await req.json();
  const db = await readDB();
  const o = db.orders.find((x) => x.id === params.id);
  if (!o) return Response.json({ error: 'Tidak ditemukan' }, { status: 404 });
  if (status === 'dibatalkan' && o.status !== 'dibatalkan')
    o.items.forEach((l) => { const p = db.products.find((x) => x.id === l.id); if (p) p.stock += l.qty; });
  o.status = status;
  await writeDB(db);
  return Response.json(o);
}
