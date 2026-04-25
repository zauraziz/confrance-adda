export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
export async function POST() {
  try { const session = await getSession(); session.destroy(); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ ok: true }); }
}
