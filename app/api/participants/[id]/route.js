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
      UPDATE participants SET
        full_name=COALESCE(${b.full_name},full_name),
        email=COALESCE(${b.email},email),
        phone=COALESCE(${b.phone},phone),
        country=COALESCE(${b.country},country),
        organization=COALESCE(${b.organization},organization),
        position=COALESCE(${b.position},position),
        participation_type=COALESCE(${b.participation_type},participation_type),
        status=COALESCE(${b.status},status),
        admin_notes=COALESCE(${b.admin_notes},admin_notes),
        updated_at=NOW()
      WHERE id=${params.id} RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await sql`DELETE FROM participants WHERE id=${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
