import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const b = await req.json();
    const { rows } = await sql`
      UPDATE sessions SET
        day_number=COALESCE(${b.day_number},day_number), start_time=COALESCE(${b.start_time},start_time),
        duration=COALESCE(${b.duration},duration), title_az=COALESCE(${b.title_az},title_az),
        title_en=COALESCE(${b.title_en},title_en), room=COALESCE(${b.room},room),
        description_az=COALESCE(${b.description_az},description_az), description_en=COALESCE(${b.description_en},description_en),
        speaker_id=COALESCE(${b.speaker_id},speaker_id), is_featured=COALESCE(${b.is_featured},is_featured),
        sort_order=COALESCE(${b.sort_order},sort_order), updated_at=NOW()
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
    await sql`DELETE FROM sessions WHERE id=${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
