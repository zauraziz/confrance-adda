export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const { token } = await req.json();
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return NextResponse.json({ ok: true, score: 1, skipped: true });
    if (!token) return NextResponse.json({ ok: false }, { status: 400 });
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'secret=' + secret + '&response=' + token });
    const data = await res.json();
    if (!data.success || data.score < 0.5) return NextResponse.json({ ok: false, score: data.score }, { status: 400 });
    return NextResponse.json({ ok: true, score: data.score });
  } catch (e) { return NextResponse.json({ ok: false, error: e.message }, { status: 500 }); }
}
