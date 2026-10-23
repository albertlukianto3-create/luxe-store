'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function Avatar({ a, size = 36 }) {
  return a?.avatar
    ? <img src={a.avatar} alt={a.name} style={{ width: size, height: size }} className="rounded-full object-cover" />
    : <div style={{ width: size, height: size }} className="grid place-items-center rounded-full bg-violet-600 text-sm font-semibold text-white">{a?.name?.[0] || '?'}</div>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState(null);
  const [noAgent, setNoAgent] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef(null);

  useEffect(() => {
    fetch('/api/agents').then((r) => r.json()).then((list) => {
      const on = list.filter((a) => a.active);
      if (!on.length) return setNoAgent(true);
      const a = on[Math.floor(Math.random() * on.length)];
      setAgent(a);
      setMsgs([{ role: 'assistant', content: `Halo! Saya ${a.name}, asisten virtual toko ini. Ada yang bisa saya bantu?` }]);
    });
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing, open]);

  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || typing || !agent) return;
    const history = [...msgs, { role: 'user', content: t }];
    setMsgs(history); setText('');

    await wait(500 + Math.random() * 700);            // jeda "membaca" pesan
    setTyping(true);
    const t0 = Date.now();
    let reply = 'Maaf, saya sedang kesulitan membalas. Silakan coba lagi sebentar lagi.';
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId: agent.id, messages: history }) });
      const d = await r.json();
      if (d.reply) reply = d.reply;
    } catch {}
    const typingTime = Math.min(5000, Math.max(1200, reply.length * 30)); // durasi mengetik sebanding panjang balasan
    await wait(Math.max(0, typingTime - (Date.now() - t0)));
    setTyping(false);
    setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            style={{ transformOrigin: 'bottom right' }} className="mb-3 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/50 sm:w-96">
            <div className="flex items-center gap-3 border-b border-white/5 bg-ink-800 p-4">
              <div className="relative"><Avatar a={agent} size={40} /><span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-ink-800 ${agent ? 'bg-emerald-400' : 'bg-zinc-500'}`} /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{agent?.name || 'Customer Service'}</p>
                <p className="text-xs text-zinc-400">{agent ? 'Asisten AI · Online' : 'Offline'}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Tutup chat" className="rounded-lg p-1.5 hover:bg-white/5"><X size={18} /></button>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
              {noAgent && <p className="py-10 text-center text-sm text-zinc-500">Semua CS sedang offline. Silakan coba lagi nanti.</p>}
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-md bg-violet-600 text-white' : 'rounded-bl-md bg-ink-700 text-zinc-100'}`}>{m.content}</p>
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="flex gap-1 rounded-2xl rounded-bl-md bg-ink-700 px-3 py-2.5">
                    {[0, 1, 2].map((d) => <motion.i key={d} className="block h-1.5 w-1.5 rounded-full bg-zinc-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />)}
                  </span>
                  {agent.name} sedang mengetik...
                </div>
              )}
              <div ref={end} />
            </div>

            <form onSubmit={send} className="flex gap-2 border-t border-white/5 p-3">
              <input disabled={!agent} value={text} onChange={(e) => setText(e.target.value)} placeholder={agent ? 'Tulis pesan...' : 'CS sedang offline'} className="input !rounded-full" />
              <button disabled={!agent || !text.trim() || typing} aria-label="Kirim" className="btn-primary !rounded-full !p-3"><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setOpen(!open)} aria-label="Chat dengan CS" className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-900/50">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
