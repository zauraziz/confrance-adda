export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { updateSetting } from '@/lib/settings';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  try { const rows = await sql`SELECT * FROM site_settings ORDER BY key`; return NextResponse.json({ items: rows }); }
  catch { return NextResponse.json({ items: [] }); }
}
export async function PATCH(req) {
  try { await requireAdmin(); const updates = await req.json(); for (const u of updates) await updateSetting(u.key, u.value); return NextResponse.json({ ok: true }); }
  catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
