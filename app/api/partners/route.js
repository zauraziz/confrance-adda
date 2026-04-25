export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  try { const rows = await sql`SELECT * FROM partners WHERE is_active = true ORDER BY sort_order`; return NextResponse.json({ items: rows }); }
  catch { return NextResponse.json({ items: [] }); }
}
export async function POST(req) {
  try { await requireAdmin(); const b = await req.json();
    const rows = await sql`INSERT INTO partners (name,logo_url,website_url,category,sort_order,is_active) VALUES (${b.name},${b.logo_url||null},${b.website_url||null},${b.category||'accreditation'},${b.sort_order||0},${b.is_active!==false}) RETURNING *`;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
