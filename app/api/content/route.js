export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql, getSiteContent } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { const content = await getSiteContent(); return NextResponse.json({ content }); }
  catch (e) { return NextResponse.json({ content: {} }); }
}
export async function PATCH(req) {
  try {
    await requireAdmin();
    const updates = await req.json();
    for (const u of updates) {
      await sql`INSERT INTO site_content (section, key, value_az, value_en) VALUES (${u.section}, ${u.key}, ${u.value_az}, ${u.value_en}) ON CONFLICT (section, key) DO UPDATE SET value_az=${u.value_az}, value_en=${u.value_en}, updated_at=NOW()`;
    }
    return NextResponse.json({ ok: true });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
