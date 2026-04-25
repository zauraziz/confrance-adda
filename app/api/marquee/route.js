export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM marquee_items WHERE is_active = true ORDER BY sort_order`;
    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error('GET /api/marquee:', e.message);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req) {
  try {
    await requireAdmin();
    const b = await req.json();
    if (!b.text_az || !b.text_en) {
      return NextResponse.json({ error: 'Mətn (AZ və EN) tələb olunur' }, { status: 400 });
    }
    const rows = await sql`
      INSERT INTO marquee_items (text_az, text_en, style, sort_order, is_active)
      VALUES (${b.text_az}, ${b.text_en}, ${b.style || 'text'}, ${b.sort_order || 0}, ${b.is_active !== false})
      RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
