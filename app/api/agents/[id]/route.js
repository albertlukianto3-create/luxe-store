import { readDB, writeDB } from '@/lib/db';
import { isAdmin, deny } from '@/lib/auth';

export async function PUT(req, { params }) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  const db = await readDB();
  const i = db.agents.findIndex((x) => x.id === params.id);
  if (i < 0) return Response.json({ error: 'Tidak ditemukan' }, { status: 404 });
  db.agents[i] = { ...db.agents[i], name: b.name, role: b.role, avatar: b.avatar, prompt: b.prompt, active: !!b.active };
  await writeDB(db);
  return Response.json(db.agents[i]);
}
export async function DELETE(_, { params }) {
  if (!isAdmin()) return deny();
  const db = await readDB();
  db.agents = db.agents.filter((x) => x.id !== params.id);
  await writeDB(db);
  return Response.json({ ok: true });
}
