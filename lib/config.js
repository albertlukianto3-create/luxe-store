export const BANK = { name: 'BCA', number: '7925409456', holder: 'Albert' };
export const SHIPPING_FEE = 15000;
export const STATUSES = {
  menunggu_pembayaran: { label: 'Menunggu pembayaran', cls: 'bg-amber-500/15 text-amber-300' },
  dibayar: { label: 'Pembayaran terverifikasi', cls: 'bg-sky-500/15 text-sky-300' },
  dikemas: { label: 'Sedang dikemas', cls: 'bg-violet-500/15 text-violet-300' },
  dikirim: { label: 'Dikirim', cls: 'bg-indigo-500/15 text-indigo-300' },
  selesai: { label: 'Selesai', cls: 'bg-emerald-500/15 text-emerald-300' },
  dibatalkan: { label: 'Dibatalkan', cls: 'bg-rose-500/15 text-rose-300' },
};
export const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
