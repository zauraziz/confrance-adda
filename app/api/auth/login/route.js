export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSession, verifyCredentials } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const { allowed, resetAt } = rateLimit(`login:${ip}`, 5, 5 * 60 * 1000); // 5 attempts per 5 min

    if (!allowed) {
      const seconds = Math.ceil((resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Çox sayda cəhd. ${seconds} saniyə sonra yenidən cəhd edin.` },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'İstifadəçi adı və şifrə tələb olunur' }, { status: 400 });
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Yanlış format' }, { status: 400 });
    }
    if (username.length > 200 || password.length > 200) {
      return NextResponse.json({ error: 'Çox uzundur' }, { status: 400 });
    }

    const admin = await verifyCredentials(username, password);
    if (!admin) {
      // Timing attack qarşısı - hər həmişə eyni müddət gözlət
      await new Promise(r => setTimeout(r, 200));
      return NextResponse.json({ error: 'Yanlış məlumatlar' }, { status: 401 });
    }

    const session = await getSession();
    session.admin = admin;
    await session.save();
    return NextResponse.json({ ok: true, admin });
  } catch (e) {
    console.error('login:', e.message);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}
