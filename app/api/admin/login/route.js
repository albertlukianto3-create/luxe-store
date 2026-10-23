import { cookies } from 'next/headers';
import { adminToken } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json();
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) return Response.json({ error: 'Password salah' }, { status: 401 });
  cookies().set('admin_token', adminToken(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 12 });
  return Response.json({ ok: true });
}
export async function DELETE() {
  cookies().delete('admin_token');
  return Response.json({ ok: true });
}
