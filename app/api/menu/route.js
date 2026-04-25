export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  try { const rows = await sql`SELECT * FROM menu_items ORDER BY position, sort_order`; return NextResponse.json({ items: rows }); }
  catch { return NextResponse.json({ items: [] }); }
}
export async function POST(req) {
  try { await requireAdmin(); const b = await req.json();
    const rows = await sql`INSERT INTO menu_items (label_az,label_en,href,sort_order,is_active,open_in_new_tab,position) VALUES (${b.label_az},${b.label_en},${b.href},${b.sort_order||0},${b.is_active!==false},${b.open_in_new_tab||false},${b.position||'header'}) RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
