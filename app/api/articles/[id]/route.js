import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sendArticleStatusUpdate } from '@/lib/email';

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const { id } = params;
    const { status, admin_notes } = await req.json();

    const { rows } = await sql`
      UPDATE articles
      SET status = COALESCE(${status}, status),
          admin_notes = COALESCE(${admin_notes}, admin_notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (status && rows[0]) {
      sendArticleStatusUpdate({
        to: rows[0].email,
        fullName: rows[0].full_name,
        title: rows[0].title,
        status,
        notes: admin_notes,
        lang: rows[0].language,
      }).catch(err => console.error('Email error:', err));
    }

    return NextResponse.json({ ok: true, item: rows[0] });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await sql`DELETE FROM articles WHERE id = ${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}
