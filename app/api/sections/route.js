export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  try { const rows = await sql`SELECT * FROM sections WHERE is_active = true ORDER BY sort_order, number`; return NextResponse.json({ items: rows }); }
  catch { return NextResponse.json({ items: [] }); }
}
export async function POST(req) {
  try { await requireAdmin(); const b = await req.json();
    const rows = await sql`INSERT INTO sections (number,title_az,title_en,title_ru,description_az,description_en,description_ru,chairs,sort_order,is_active) VALUES (${b.number},${b.title_az},${b.title_en},${b.title_ru||null},${b.description_az||null},${b.description_en||null},${b.description_ru||null},${b.chairs||null},${b.sort_order||0},${b.is_active!==false}) RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
