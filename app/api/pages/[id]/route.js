import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const b = await req.json();
    const { rows } = await sql`
      UPDATE pages SET
        slug=COALESCE(${b.slug},slug), title_az=COALESCE(${b.title_az},title_az),
        title_en=COALESCE(${b.title_en},title_en), content_az=COALESCE(${b.content_az},content_az),
        content_en=COALESCE(${b.content_en},content_en), meta_desc_az=COALESCE(${b.meta_desc_az},meta_desc_az),
        meta_desc_en=COALESCE(${b.meta_desc_en},meta_desc_en), show_in_menu=COALESCE(${b.show_in_menu},show_in_menu),
        is_published=COALESCE(${b.is_published},is_published), sort_order=COALESCE(${b.sort_order},sort_order),
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
    await sql`DELETE FROM pages WHERE id=${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
