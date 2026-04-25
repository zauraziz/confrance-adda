export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const { status, admin_notes } = await req.json();
    const rows = await sql`UPDATE articles SET status=COALESCE(${status},status), admin_notes=COALESCE(${admin_notes},admin_notes), updated_at=NOW() WHERE id=${params.id} RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try { await requireAdmin(); await sql`DELETE FROM articles WHERE id=${params.id}`; return NextResponse.json({ ok: true }); }
  catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
