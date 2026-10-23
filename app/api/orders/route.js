import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';
import { SHIPPING_FEE } from '@/lib/config';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return deny();
  return Response.json((await readDB()).orders);
}

export async function POST(req) {
  const { customer, items } = await req.json();
  if (!customer?.name || !customer?.phone || !customer?.address || !items?.length)
    return Response.json({ error: 'Lengkapi nama, nomor HP, alamat, dan isi keranjang' }, { status: 400 });

  const db = await readDB();
  const lines = [];
  // Harga & stok selalu diverifikasi di server, bukan dari data browser
  for (const it of items) {
    const p = db.products.find((x) => x.id === it.id);
    const qty = parseInt(it.qty);
    if (!p || !(qty > 0) || qty > p.stock) return Response.json({ error: `Stok "${p?.name || 'produk'}" tidak mencukupi` }, { status: 400 });
    lines.push({ id: p.id, name: p.name, price: p.price, qty });
  }
  lines.forEach((l) => { db.products.find((x) => x.id === l.id).stock -= l.qty; });

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const used = new Set(db.orders.filter((o) => o.status === 'menunggu_pembayaran').map((o) => o.uniqueCode));
  let uniqueCode;
  do { uniqueCode = 1 + Math.floor(Math.random() * 999); } while (used.has(uniqueCode));

  const order = {
    id: 'ORD-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: 'menunggu_pembayaran',
    customer: { name: customer.name, phone: customer.phone, address: customer.address, note: customer.note || '' },
    items: lines, subtotal, shipping: SHIPPING_FEE, uniqueCode,
    total: subtotal + SHIPPING_FEE + uniqueCode,
  };
  db.orders.unshift(order);
  await writeDB(db);
  return Response.json(order);
}
