'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { rupiah } from '@/lib/config';

export default function ProductPage() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(undefined);
  const [qty, setQty] = useState(1);

  useEffect(() => { fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null)).then(setP); }, [id]);
  if (p === undefined) return <div className="card aspect-[16/9] animate-pulse" />;
  if (!p) return <p className="py-20 text-center text-zinc-500">Produk tidak ditemukan. <Link href="/" className="text-gold underline">Kembali ke toko</Link></p>;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href="/" className="mb-5 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Semua produk</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card aspect-square overflow-hidden">{p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}</div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-zinc-500">{p.category}</p>
          <h1 className="mt-1 font-display text-3xl text-white sm:text-4xl">{p.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-gold">{rupiah(p.price)}</p>
          <p className="mt-4 leading-relaxed text-zinc-400">{p.description}</p>
          <p className="mt-4 text-sm text-zinc-500">{p.stock > 0 ? `Tersedia ${p.stock} unit` : 'Stok habis'}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-white/10">
              <button className="p-3" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button className="p-3" aria-label="Tambah" onClick={() => setQty((q) => Math.min(p.stock, q + 1))}><Plus size={16} /></button>
            </div>
            <button disabled={p.stock < 1} onClick={() => add(p, qty)} className="btn-primary flex-1">Tambah ke keranjang</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
