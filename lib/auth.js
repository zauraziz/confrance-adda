import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'adda_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 saat
  },
};

export async function getSession() {
  return await getIronSession(cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.admin) {
    throw new Error('UNAUTHORIZED');
  }
  return session.admin;
}

export async function verifyCredentials(username, password) {
  const { rows } = await sql`SELECT * FROM admins WHERE username = ${username} OR email = ${username} LIMIT 1`;
  const admin = rows[0];
  if (!admin) return null;

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return null;

  await sql`UPDATE admins SET last_login = NOW() WHERE id = ${admin.id}`;
  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
  };
}
