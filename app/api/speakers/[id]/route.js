export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin(); const b = await req.json();
    const rows = await sql`UPDATE speakers SET name_az=COALESCE(${b.name_az},name_az),name_en=COALESCE(${b.name_en},name_en),role_az=COALESCE(${b.role_az},role_az),role_en=COALESCE(${b.role_en},role_en),bio_az=COALESCE(${b.bio_az},bio_az),bio_en=COALESCE(${b.bio_en},bio_en),country=COALESCE(${b.country},country),photo_url=COALESCE(${b.photo_url},photo_url),is_featured=COALESCE(${b.is_featured},is_featured),sort_order=COALESCE(${b.sort_order},sort_order),slug=COALESCE(${b.slug},slug),updated_at=NOW() WHERE id=${params.id} RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req, { params }) {
  try { await requireAdmin(); await sql`DELETE FROM speakers WHERE id=${params.id}`; return NextResponse.json({ ok: true }); }
  catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
