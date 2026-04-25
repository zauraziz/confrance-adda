export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const b = await req.json();
    const rows = await sql`
      UPDATE marquee_items SET
        text_az    = COALESCE(${b.text_az}, text_az),
        text_en    = COALESCE(${b.text_en}, text_en),
        style      = COALESCE(${b.style}, style),
        sort_order = COALESCE(${b.sort_order}, sort_order),
        is_active  = COALESCE(${b.is_active}, is_active)
      WHERE id = ${params.id}
      RETURNING *`;
    if (!rows[0]) return NextResponse.json({ error: 'Tapılmadı' }, { status: 404 });
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await sql`DELETE FROM marquee_items WHERE id = ${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
