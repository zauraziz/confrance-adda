export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function PATCH(req, { params }) {
  try { await requireAdmin(); const b = await req.json();
    const rows = await sql`UPDATE partners SET name=COALESCE(${b.name},name),logo_url=COALESCE(${b.logo_url},logo_url),website_url=COALESCE(${b.website_url},website_url),category=COALESCE(${b.category},category),sort_order=COALESCE(${b.sort_order},sort_order),is_active=COALESCE(${b.is_active},is_active) WHERE id=${params.id} RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req, { params }) {
  try { await requireAdmin(); await sql`DELETE FROM partners WHERE id=${params.id}`; return NextResponse.json({ ok: true }); }
  catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
