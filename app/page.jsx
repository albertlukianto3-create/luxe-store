'use client';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState(null);
  const [cat, setCat] = useState('Semua');
  const [q, setQ] = useState('');

  useEffect(() => { fetch('/api/products').then((r) => r.json()).then(setProducts); }, []);
  const cats = useMemo(() => ['Semua', ...new Set((products || []).map((p) => p.category))], [products]);
  const list = (products || []).filter((p) => (cat === 'Semua' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="py-12 sm:py-20">
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] text-white sm:text-6xl">Barang pilihan, dikirim dengan rapi ke depan pintu Anda.</h1>
        <p className="mt-5 max-w-lg text-zinc-400">Bayar lewat transfer BCA, pesanan langsung kami proses begitu pembayaran terverifikasi.</p>
      </motion.section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${cat === c ? 'text-ink-950' : 'text-zinc-400 hover:text-white'}`}>
              {cat === c && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-gold" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input className="input !pl-10" placeholder="Cari produk" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {!products ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card aspect-[3/4] animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <p className="py-20 text-center text-zinc-500">Tidak ada produk yang cocok. Coba kata kunci atau kategori lain.</p>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
