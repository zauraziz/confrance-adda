export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function PATCH(req, { params }) {
  try { await requireAdmin(); const b = await req.json();
    const rows = await sql`UPDATE sections SET number=COALESCE(${b.number},number),title_az=COALESCE(${b.title_az},title_az),title_en=COALESCE(${b.title_en},title_en),title_ru=COALESCE(${b.title_ru},title_ru),description_az=COALESCE(${b.description_az},description_az),description_en=COALESCE(${b.description_en},description_en),description_ru=COALESCE(${b.description_ru},description_ru),chairs=COALESCE(${b.chairs},chairs),sort_order=COALESCE(${b.sort_order},sort_order),is_active=COALESCE(${b.is_active},is_active) WHERE id=${params.id} RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req, { params }) {
  try { await requireAdmin(); await sql`DELETE FROM sections WHERE id=${params.id}`; return NextResponse.json({ ok: true }); }
  catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
