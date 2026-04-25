export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try { const items = await sql`SELECT * FROM pages ORDER BY sort_order, created_at`; return NextResponse.json({ items }); }
  catch { return NextResponse.json({ items: [] }); }
}
export async function POST(req) {
  try {
    await requireAdmin(); const b = await req.json();
    const slug = b.slug || (b.title_en||b.title_az||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const rows = await sql`INSERT INTO pages (slug,title_az,title_en,content_az,content_en,meta_desc_az,meta_desc_en,show_in_menu,is_published,sort_order) VALUES (${slug},${b.title_az},${b.title_en},${b.content_az},${b.content_en},${b.meta_desc_az},${b.meta_desc_en},${b.show_in_menu||false},${b.is_published!==false},${b.sort_order||0}) RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
