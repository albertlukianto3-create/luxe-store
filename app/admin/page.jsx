'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, ClipboardList, Headset, Pencil, Trash2, Plus, X, LogOut } from 'lucide-react';
import { STATUSES, rupiah } from '@/lib/config';

const api = async (url, method = 'GET', body) => {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Terjadi kesalahan');
  return d;
};

function Modal({ title, onClose, children }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }} className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-xl text-white">{title}</h3><button onClick={onClose} aria-label="Tutup"><X size={18} /></button></div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Produk ---------- */
function ProductsTab() {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(null);
  const load = useCallback(() => api('/api/products').then(setList), []);
  useEffect(() => { load(); }, [load]);

  async function save(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    try { edit.id ? await api(`/api/products/${edit.id}`, 'PUT', f) : await api('/api/products', 'POST', f); setEdit(null); load(); } catch (er) { alert(er.message); }
  }
  async function del(p) { if (confirm(`Hapus "${p.name}"?`)) { await api(`/api/products/${p.id}`, 'DELETE'); load(); } }

  return (
    <>
      <button className="btn-gold mb-4" onClick={() => setEdit({})}><Plus size={16} /> Tambah produk</button>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className="card flex gap-3 p-3">
            <img src={p.image} alt="" className="h-20 w-20 rounded-lg bg-ink-800 object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate font-medium text-white">{p.name}</p><p className="text-sm text-gold">{rupiah(p.price)}</p><p className="text-xs text-zinc-500">Stok {p.stock} · {p.category}</p></div>
            <div className="flex flex-col gap-1"><button onClick={() => setEdit(p)} aria-label="Edit" className="rounded-lg p-2 hover:bg-white/5"><Pencil size={15} /></button><button onClick={() => del(p)} aria-label="Hapus" className="rounded-lg p-2 text-rose-400 hover:bg-white/5"><Trash2 size={15} /></button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {edit && (
          <Modal title={edit.id ? 'Edit produk' : 'Produk baru'} onClose={() => setEdit(null)}>
            <form onSubmit={save} className="space-y-3">
              <input name="name" required className="input" placeholder="Nama produk" defaultValue={edit.name} />
              <input name="category" className="input" placeholder="Kategori" defaultValue={edit.category} />
              <textarea name="description" rows={3} className="input" placeholder="Deskripsi" defaultValue={edit.description} />
              <div className="grid grid-cols-2 gap-3"><input name="price" type="number" min="1" required className="input" placeholder="Harga (Rp)" defaultValue={edit.price} /><input name="stock" type="number" min="0" required className="input" placeholder="Stok" defaultValue={edit.stock} /></div>
              <input name="image" className="input" placeholder="URL gambar (https://...)" defaultValue={edit.image} />
              <button className="btn-primary w-full">Simpan produk</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Pesanan ---------- */
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const load = useCallback(() => api('/api/orders').then(setOrders), []);
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);
  const setStatus = async (id, status) => { await api(`/api/orders/${id}`, 'PATCH', { status }); load(); };

  if (!orders.length) return <p className="py-16 text-center text-zinc-500">Belum ada pesanan masuk.</p>;
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-medium text-white">{o.id} <span className="text-sm font-normal text-zinc-500">· {new Date(o.createdAt).toLocaleString('id-ID')}</span></p><p className="text-sm text-zinc-400">{o.customer.name} · {o.customer.phone}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs ${STATUSES[o.status].cls}`}>{STATUSES[o.status].label}</span>
          </div>
          <p className="text-sm text-zinc-400">{o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}</p>
          <p className="text-sm text-zinc-500">{o.customer.address}{o.customer.note && ` — Catatan: ${o.customer.note}`}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-gold">Cek mutasi: {rupiah(o.total)}</p>
            <select className="input !w-auto" value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- CS ---------- */
function AgentsTab() {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(null);
  const load = useCallback(() => api('/api/agents?full=1').then(setList), []);
  useEffect(() => { load(); }, [load]);

  async function save(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const f = { ...Object.fromEntries(fd), active: fd.get('active') === 'on' };
    try { edit.id ? await api(`/api/agents/${edit.id}`, 'PUT', f) : await api('/api/agents', 'POST', f); setEdit(null); load(); } catch (er) { alert(er.message); }
  }
  const toggle = async (a) => { await api(`/api/agents/${a.id}`, 'PUT', { ...a, active: !a.active }); load(); };
  async function del(a) { if (confirm(`Hapus CS "${a.name}"?`)) { await api(`/api/agents/${a.id}`, 'DELETE'); load(); } }

  return (
    <>
      <button className="btn-gold mb-4" onClick={() => setEdit({ active: true })}><Plus size={16} /> Tambah CS</button>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((a) => (
          <div key={a.id} className="card space-y-3 p-4">
            <div className="flex items-center gap-3">
              {a.avatar ? <img src={a.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-full bg-violet-600 text-white">{a.name[0]}</div>}
              <div className="flex-1"><p className="font-medium text-white">{a.name}</p><p className="text-xs text-zinc-500">{a.role}</p></div>
              <button onClick={() => toggle(a)} className={`rounded-full px-3 py-1 text-xs ${a.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-500/15 text-zinc-400'}`}>{a.active ? 'Online' : 'Offline'}</button>
            </div>
            <p className="line-clamp-2 text-sm text-zinc-400">{a.prompt || 'Belum ada kepribadian khusus.'}</p>
            <div className="flex gap-2"><button className="btn-ghost !py-1.5" onClick={() => setEdit(a)}><Pencil size={14} /> Edit</button><button className="btn-ghost !py-1.5 text-rose-400" onClick={() => del(a)}><Trash2 size={14} /> Hapus</button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {edit && (
          <Modal title={edit.id ? 'Edit CS' : 'CS baru'} onClose={() => setEdit(null)}>
            <form onSubmit={save} className="space-y-3">
              <input name="name" required className="input" placeholder="Nama CS (mis. Ayu)" defaultValue={edit.name} />
              <input name="role" className="input" placeholder="Jabatan (mis. Customer Service)" defaultValue={edit.role} />
              <input name="avatar" className="input" placeholder="URL foto avatar" defaultValue={edit.avatar} />
              <textarea name="prompt" rows={5} className="input" placeholder="Kepribadian & gaya bicara, mis. super ramah dan santai, pakai emoji." defaultValue={edit.prompt} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={edit.active} className="accent-violet-500" /> Tampil online di toko</label>
              <button className="btn-primary w-full">Simpan CS</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Halaman ---------- */
export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('orders');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { fetch('/api/orders').then((r) => setAuthed(r.ok)); }, []);

  async function login(e) {
    e.preventDefault();
    try { await api('/api/admin/login', 'POST', { password: pw }); setAuthed(true); } catch (er) { setErr(er.message); }
  }
  async function logout() { await api('/api/admin/login', 'DELETE'); setAuthed(false); setPw(''); }

  if (authed === null) return null;
  if (!authed) return (
    <motion.form onSubmit={login} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto mt-16 max-w-sm space-y-4 p-6">
      <h1 className="font-display text-2xl text-white">Masuk admin</h1>
      <input type="password" autoFocus className="input" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
      {err && <p className="text-sm text-rose-300">{err}</p>}
      <button className="btn-primary w-full">Masuk</button>
    </motion.form>
  );

  const tabs = [['orders', 'Pesanan', ClipboardList], ['products', 'Produk', Package], ['agents', 'CS', Headset]];
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-ink-800 p-1">
          {tabs.map(([k, label, Icon]) => (
            <button key={k} onClick={() => setTab(k)} className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${tab === k ? 'text-white' : 'text-zinc-400'}`}>
              {tab === k && <motion.span layoutId="tab" className="absolute inset-0 rounded-lg bg-violet-600" />}
              <Icon size={16} className="relative" /><span className="relative">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={logout} className="btn-ghost !px-3" aria-label="Keluar"><LogOut size={16} /></button>
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'orders' && <OrdersTab />}{tab === 'products' && <ProductsTab />}{tab === 'agents' && <AgentsTab />}
      </motion.div>
    </div>
  );
}
