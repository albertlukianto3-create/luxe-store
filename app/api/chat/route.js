import { readDB } from '@/lib/db';
import { BANK, rupiah } from '@/lib/config';

export async function POST(req) {
  const { agentId, messages } = await req.json();
  const db = await readDB();
  const agent = db.agents.find((a) => a.id === agentId && a.active);
  if (!agent) return Response.json({ error: 'CS sedang offline' }, { status: 404 });
  if (!process.env.OPENROUTER_API_KEY) return Response.json({ error: 'OPENROUTER_API_KEY belum diisi' }, { status: 500 });

  const catalog = db.products.map((p) => `- ${p.name} (${p.category}) ${rupiah(p.price)}, stok ${p.stock}`).join('\n');
  const system = `Kamu adalah ${agent.name}, asisten virtual (AI) untuk toko online ini. Jawab dalam Bahasa Indonesia, singkat (1-3 kalimat), natural.
ATURAN WAJIB:
- Kamu adalah AI. Jika ditanya apakah kamu manusia/bot, jawab jujur bahwa kamu asisten virtual berbasis AI. Jangan pernah mengaku manusia.
- Jangan mengarang info: status pesanan, stok, atau kebijakan yang tidak ada di data. Jika tidak tahu, sarankan pelanggan menunggu konfirmasi admin toko.
- Pembayaran hanya via transfer ${BANK.name} ${BANK.number} a.n. ${BANK.holder}. Nominal transfer harus persis sesuai total (termasuk kode unik) di halaman pesanan.
KATALOG:
${catalog}
GAYA BICARA:
${agent.prompt}`;

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        max_tokens: 300,
        messages: [{ role: 'system', content: system }, ...(messages || []).slice(-12)],
      }),
    });
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('empty');
    return Response.json({ reply });
  } catch {
    return Response.json({ error: 'Gagal membalas' }, { status: 502 });
  }
}
