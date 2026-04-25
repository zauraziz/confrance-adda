export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import { sendArticleConfirmation, sendAdminNotification } from '@/lib/email';
import { requireAdmin } from '@/lib/auth';

const ArticleSchema = z.object({
  full_name: z.string().min(2).max(160),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  organization: z.string().max(255).optional().nullable(),
  position: z.string().max(160).optional().nullable(),
  title: z.string().min(8).max(300),
  abstract: z.string().min(50).max(3000),
  keywords: z.string().max(300).optional().nullable(),
  topic_area: z.string().max(120).optional().nullable(),
  language: z.enum(['az', 'en']).default('az'),
  participation_type: z.string().max(30).optional().nullable(),
  file_url: z.string().optional().nullable(),
  file_name: z.string().optional().nullable(),
  section_id: z.number().optional().nullable(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = ArticleSchema.parse(body);
    const rows = await sql`
      INSERT INTO articles (full_name, email, phone, country, organization, position, title, abstract, keywords, topic_area, language, participation_type, file_url, file_name, section_id)
      VALUES (${data.full_name}, ${data.email}, ${data.phone||null}, ${data.country||null}, ${data.organization||null},
              ${data.position||null}, ${data.title}, ${data.abstract}, ${data.keywords||null},
              ${data.topic_area||null}, ${data.language}, ${data.participation_type||'article'},
              ${data.file_url||null}, ${data.file_name||null}, ${data.section_id||null})
      RETURNING id`;
    Promise.all([
      sendArticleConfirmation({ to: data.email, fullName: data.full_name, title: data.title, lang: data.language }).catch(e => console.error(e.message)),
      sendAdminNotification({ fullName: data.full_name, email: data.email, title: data.title }).catch(e => console.error(e.message)),
    ]);
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e) {
    if (e.errors) return NextResponse.json({ error: e.errors }, { status: 400 });
    console.error('POST /api/articles:', e.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    let rows;
    if (status && q) {
      rows = await sql`SELECT * FROM articles WHERE status=${status} AND (full_name ILIKE ${'%'+q+'%'} OR title ILIKE ${'%'+q+'%'}) ORDER BY created_at DESC`;
    } else if (status) {
      rows = await sql`SELECT * FROM articles WHERE status=${status} ORDER BY created_at DESC`;
    } else if (q) {
      rows = await sql`SELECT * FROM articles WHERE full_name ILIKE ${'%'+q+'%'} OR title ILIKE ${'%'+q+'%'} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM articles ORDER BY created_at DESC`;
    }
    return NextResponse.json({ items: rows });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
