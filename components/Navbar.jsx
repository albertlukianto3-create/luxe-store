'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl tracking-tight text-white">Luxe<span className="text-gold">.</span>Store</Link>
        <button onClick={() => setOpen(true)} aria-label="Buka keranjang" className="relative rounded-xl p-2.5 transition hover:bg-white/5">
          <ShoppingBag size={22} />
          <AnimatePresence>
            {count > 0 && (
              <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink-950">{count}</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
