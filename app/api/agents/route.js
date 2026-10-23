import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { agents } = await readDB();
  const full = new URL(req.url).searchParams.get('full') && isAdmin();
  // Publik tidak pernah menerima system prompt
  return Response.json(full ? agents : agents.map(({ prompt, ...a }) => a));
}
export async function POST(req) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  if (!b.name) return Response.json({ error: 'Nama wajib diisi' }, { status: 400 });
  const db = await readDB();
  const a = { id: crypto.randomUUID().slice(0, 8), name: b.name, role: b.role || 'Customer Service', avatar: b.avatar || '', prompt: b.prompt || '', active: b.active !== false };
  db.agents.push(a);
  await writeDB(db);
  return Response.json(a);
}
