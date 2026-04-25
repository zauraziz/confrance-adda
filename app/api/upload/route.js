export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/blob';
import { requireAdmin } from '@/lib/auth';
export async function POST(req) {
  try {
    const fd = await req.formData(); const file = fd.get('file'); const folder = fd.get('folder') || 'uploads'; const kind = fd.get('kind') || 'document'; const isPublic = fd.get('public') === 'true';
    if (!isPublic) await requireAdmin();
    if (!file) return NextResponse.json({ error: 'Fayl yoxdur' }, { status: 400 });
    const result = await uploadFile(file, folder, kind);
    return NextResponse.json({ ok: true, url: result.url });
  } catch (e) { if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 }); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
