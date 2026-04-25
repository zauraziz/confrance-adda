export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getSession, verifyCredentials } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'İstifadəçi adı və şifrə tələb olunur' }, { status: 400 });
    const admin = await verifyCredentials(username, password);
    if (!admin) return NextResponse.json({ error: 'Yanlış məlumatlar' }, { status: 401 });
    const session = await getSession();
    session.admin = admin;
    await session.save();
    return NextResponse.json({ ok: true, admin });
  } catch (e) { console.error('login:', e.message); return NextResponse.json({ error: 'Server xətası' }, { status: 500 }); }
}
