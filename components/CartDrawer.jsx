'use client';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { rupiah } from '@/lib/config';

export default function CartDrawer() {
  const { open, setOpen, items, setQty, subtotal } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bg" className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside key="panel" role="dialog" aria-label="Keranjang" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-ink-900"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <h2 className="font-display text-xl text-white">Keranjang</h2>
              <button onClick={() => setOpen(false)} aria-label="Tutup" className="rounded-lg p-1.5 hover:bg-white/5"><X size={20} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.length === 0 && (
                <div className="grid h-full place-items-center text-center text-zinc-500"><div><ShoppingBag className="mx-auto mb-3" size={32} />Keranjang masih kosong.<br />Pilih produk untuk mulai belanja.</div></div>
              )}
              <AnimatePresence initial={false}>
                {items.map((i) => (
                  <motion.div key={i.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="card flex gap-3 p-3">
                    <img src={i.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{i.name}</p>
                      <p className="text-sm text-gold">{rupiah(i.price)}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-sm">
                        <button aria-label="Kurangi" onClick={() => setQty(i.id, i.qty - 1)} className="rounded-md border border-white/10 p-1"><Minus size={14} /></button>
                        <span className="w-5 text-center">{i.qty}</span>
                        <button aria-label="Tambah" onClick={() => setQty(i.id, i.qty + 1)} className="rounded-md border border-white/10 p-1"><Plus size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {items.length > 0 && (
              <div className="border-t border-white/5 p-5">
                <div className="mb-4 flex justify-between"><span className="text-zinc-400">Subtotal</span><span className="font-semibold text-white">{rupiah(subtotal)}</span></div>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full">Lanjut ke checkout</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
