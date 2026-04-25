import { NextResponse } from 'next/server';
import { sql, getSpeakers } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const items = await getSpeakers();
  return NextResponse.json({ items });
}

export async function POST(req) {
  try {
    await requireAdmin();
    const b = await req.json();
    const slug = b.slug || slugify(b.name_en || b.name_az);
    const { rows } = await sql`
      INSERT INTO speakers (name_az, name_en, role_az, role_en, bio_az, bio_en, country, photo_url, linkedin, twitter, email, is_featured, sort_order, slug)
      VALUES (${b.name_az}, ${b.name_en}, ${b.role_az}, ${b.role_en}, ${b.bio_az}, ${b.bio_en}, ${b.country}, ${b.photo_url}, ${b.linkedin}, ${b.twitter}, ${b.email}, ${b.is_featured || false}, ${b.sort_order || 0}, ${slug})
      RETURNING *
    `;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
