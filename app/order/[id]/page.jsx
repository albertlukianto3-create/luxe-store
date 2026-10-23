'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { BANK, STATUSES, rupiah } from '@/lib/config';

function CopyBtn({ value }) {
  const [ok, setOk] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500); }} className="btn-ghost !px-3 !py-1.5" aria-label="Salin">{ok ? <Check size={15} /> : <Copy size={15} />}</button>;
}

export default function OrderPage() {
  const { id } = useParams();
  const [o, setO] = useState(undefined);
  useEffect(() => { fetch(`/api/orders/${id}`).then((r) => (r.ok ? r.json() : null)).then(setO); }, [id]);

  if (o === undefined) return <div className="card h-64 animate-pulse" />;
  if (!o) return <p className="py-20 text-center text-zinc-500">Pesanan tidak ditemukan.</p>;
  const st = STATUSES[o.status];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl space-y-5">
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }}><CheckCircle2 className="mx-auto text-emerald-400" size={52} /></motion.div>
        <h1 className="mt-3 font-display text-3xl text-white">Pesanan dibuat</h1>
        <p className="mt-1 text-sm text-zinc-400">No. pesanan <b className="text-zinc-200">{o.id}</b> · simpan halaman ini untuk memantau status.</p>
        <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${st.cls}`}>{st.label}</span>
      </div>

      {o.status === 'menunggu_pembayaran' && (
        <div className="card space-y-4 border-gold/30 p-5">
          <h2 className="font-medium text-white">Transfer ke rekening berikut</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-400">Bank</span><b>{BANK.name}</b></div>
            <div className="flex items-center justify-between"><span className="text-zinc-400">No. rekening</span><span className="flex items-center gap-2"><b className="tracking-wider">{BANK.number}</b><CopyBtn value={BANK.number} /></span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Atas nama</span><b>{BANK.holder}</b></div>
          </div>
          <div className="rounded-xl bg-gold/10 p-4">
            <p className="text-xs text-zinc-400">Nominal yang harus ditransfer (tepat sampai digit terakhir)</p>
            <div className="mt-1 flex items-center justify-between"><p className="text-2xl font-semibold text-gold">{rupiah(o.total)}</p><CopyBtn value={String(o.total)} /></div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">Tiga digit terakhir ({o.uniqueCode}) adalah kode unik agar pembayaran Anda dapat dikenali. Setelah transfer, admin akan memverifikasi lalu mengemas dan mengirim pesanan.</p>
        </div>
      )}

      <div className="card space-y-2 p-5 text-sm">
        {o.items.map((i) => <div key={i.id} className="flex justify-between"><span className="text-zinc-400">{i.name} × {i.qty}</span><span>{rupiah(i.price * i.qty)}</span></div>)}
        <div className="flex justify-between"><span className="text-zinc-400">Ongkir</span><span>{rupiah(o.shipping)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-400">Kode unik</span><span>{rupiah(o.uniqueCode)}</span></div>
        <hr className="border-white/5" />
        <div className="flex justify-between font-semibold text-white"><span>Total</span><span>{rupiah(o.total)}</span></div>
      </div>
      <Link href="/" className="btn-ghost w-full">Kembali ke toko</Link>
    </motion.div>
  );
}
