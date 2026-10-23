'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { rupiah } from '@/lib/config';

export default function ProductCard({ p, i = 0 }) {
  const { add } = useCart();
  const soldOut = p.stock < 1;
  return (
    <motion.article layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }} className="card group overflow-hidden">
      <Link href={`/product/${p.id}`} className="block aspect-[4/3] overflow-hidden bg-ink-800">
        {p.image && <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      </Link>
      <div className="p-4">
        <p className="text-xs text-zinc-500">{p.category}</p>
        <Link href={`/product/${p.id}`} className="mt-0.5 block truncate font-medium text-white">{p.name}</Link>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gold">{rupiah(p.price)}</p>
            <p className="text-xs text-zinc-500">{soldOut ? 'Stok habis' : `Stok ${p.stock}`}</p>
          </div>
          <button disabled={soldOut} onClick={() => add(p)} aria-label={`Tambah ${p.name} ke keranjang`} className="btn-primary !rounded-full !p-2.5"><Plus size={18} /></button>
        </div>
      </div>
    </motion.article>
  );
}
