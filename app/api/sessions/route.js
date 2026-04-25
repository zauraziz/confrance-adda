import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const { rows } = await sql`SELECT * FROM sessions ORDER BY day_number, start_time, sort_order`;
  return NextResponse.json({ items: rows });
}

export async function POST(req) {
  try {
    await requireAdmin();
    const b = await req.json();
    const { rows } = await sql`
      INSERT INTO sessions (day_number, start_time, duration, title_az, title_en, room, description_az, description_en, speaker_id, is_featured, sort_order)
      VALUES (${b.day_number}, ${b.start_time}, ${b.duration||60}, ${b.title_az}, ${b.title_en}, ${b.room}, ${b.description_az}, ${b.description_en}, ${b.speaker_id||null}, ${b.is_featured||false}, ${b.sort_order||0})
      RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
