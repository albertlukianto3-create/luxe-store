'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { rupiah, SHIPPING_FEE } from '@/lib/config';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', address: '', note: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (items.length === 0) return <p className="py-20 text-center text-zinc-500">Keranjang kosong. <Link href="/" className="text-gold underline">Mulai belanja</Link></p>;

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: f, items: items.map((i) => ({ id: i.id, qty: i.qty })) }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error); setBusy(false); return; }
    clear(); router.push(`/order/${d.id}`);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 md:grid-cols-5">
      <form onSubmit={submit} className="space-y-4 md:col-span-3">
        <h1 className="font-display text-3xl text-white">Data pengiriman</h1>
        <input required className="input" placeholder="Nama lengkap" value={f.name} onChange={set('name')} />
        <input required type="tel" className="input" placeholder="Nomor WhatsApp / HP" value={f.phone} onChange={set('phone')} />
        <textarea required rows={3} className="input" placeholder="Alamat lengkap" value={f.address} onChange={set('address')} />
        <textarea rows={2} className="input" placeholder="Catatan untuk penjual (opsional)" value={f.note} onChange={set('note')} />
        {err && <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">{err}</p>}
        <button disabled={busy} className="btn-gold w-full">{busy ? 'Memproses...' : 'Buat pesanan'}</button>
      </form>
      <aside className="card h-fit space-y-3 p-5 md:col-span-2">
        <h2 className="font-display text-xl text-white">Ringkasan</h2>
        {items.map((i) => <div key={i.id} className="flex justify-between text-sm"><span className="text-zinc-400">{i.name} × {i.qty}</span><span>{rupiah(i.price * i.qty)}</span></div>)}
        <hr className="border-white/5" />
        <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span>{rupiah(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-zinc-400">Ongkir</span><span>{rupiah(SHIPPING_FEE)}</span></div>
        <p className="text-xs text-zinc-500">Kode unik 3 digit ditambahkan setelah pesanan dibuat agar pembayaran mudah diverifikasi.</p>
      </aside>
    </motion.div>
  );
}
