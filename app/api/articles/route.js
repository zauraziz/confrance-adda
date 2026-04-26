export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import { sendArticleConfirmation, sendAdminNotification } from '@/lib/email';
import { requireAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

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
  file_url: z.string().url().max(500).optional().nullable(),
  file_name: z.string().max(255).optional().nullable(),
  section_id: z.number().int().positive().optional().nullable(),
});

// XSS - HTML stripping
function sanitize(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/<[^>]*>/g, '').trim();
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`article:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çox sayda müraciət. 1 saat sonra yenidən cəhd edin.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = ArticleSchema.parse(body);

    // Sanitize string inputs against XSS
    const clean = {
      ...data,
      full_name: sanitize(data.full_name),
      organization: sanitize(data.organization),
      position: sanitize(data.position),
      title: sanitize(data.title),
      abstract: sanitize(data.abstract),
      keywords: sanitize(data.keywords),
    };

    const rows = await sql`
      INSERT INTO articles (full_name, email, phone, country, organization, position, title, abstract, keywords, topic_area, language, participation_type, file_url, file_name, section_id)
      VALUES (${clean.full_name}, ${clean.email}, ${clean.phone||null}, ${clean.country||null}, ${clean.organization||null},
              ${clean.position||null}, ${clean.title}, ${clean.abstract}, ${clean.keywords||null},
              ${clean.topic_area||null}, ${clean.language}, ${clean.participation_type||'article'},
              ${clean.file_url||null}, ${clean.file_name||null}, ${clean.section_id||null})
      RETURNING id`;

    Promise.all([
      sendArticleConfirmation({ to: clean.email, fullName: clean.full_name, title: clean.title, lang: clean.language }).catch(e => console.error(e.message)),
      sendAdminNotification({ fullName: clean.full_name, email: clean.email, title: clean.title }).catch(e => console.error(e.message)),
    ]);

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e) {
    if (e.errors) {
      const msgs = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ error: msgs }, { status: 400 });
    }
    console.error('POST /api/articles:', e.message);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
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
      rows = await sql`SELECT * FROM articles WHERE status=${status} AND (full_name ILIKE ${'%'+q+'%'} OR title ILIKE ${'%'+q+'%'}) ORDER BY created_at DESC LIMIT 200`;
    } else if (status) {
      rows = await sql`SELECT * FROM articles WHERE status=${status} ORDER BY created_at DESC LIMIT 200`;
    } else if (q) {
      rows = await sql`SELECT * FROM articles WHERE full_name ILIKE ${'%'+q+'%'} OR title ILIKE ${'%'+q+'%'} ORDER BY created_at DESC LIMIT 200`;
    } else {
      rows = await sql`SELECT * FROM articles ORDER BY created_at DESC LIMIT 200`;
    }
    return NextResponse.json({ items: rows });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
