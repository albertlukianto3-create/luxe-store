import { cookies } from 'next/headers';
import crypto from 'crypto';

export const adminToken = () =>
  crypto.createHmac('sha256', process.env.AUTH_SECRET || 'dev-secret').update(process.env.ADMIN_PASSWORD || 'admin123').digest('hex');
export const isAdmin = () => cookies().get('admin_token')?.value === adminToken();
export const deny = () => Response.json({ error: 'Tidak diizinkan' }, { status: 401 });
