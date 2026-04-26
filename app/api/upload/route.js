export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/blob';
import { requireAdmin } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

// Public folders üçün icazə (admin auth-suz)
const PUBLIC_FOLDERS = new Set(['articles']);

export async function POST(req) {
  try {
    const fd = await req.formData();
    const file = fd.get('file');
    const folder = String(fd.get('folder') || 'uploads').replace(/[^a-z0-9_-]/gi, '');
    const kind = String(fd.get('kind') || 'document');
    const isPublicReq = fd.get('public') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'Fayl yoxdur' }, { status: 400 });
    }

    // Tip yoxlaması (server-side hard check)
    const allowedTypes = kind === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Bu fayl növü qadağandır: ${file.type}` },
        { status: 400 }
      );
    }

    // Ölçü yoxlaması (server-side hard check)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fayl 10 MB-dan böyük ola bilməz' },
        { status: 400 }
      );
    }

    // Public yükləmə yalnız white-listed folder-lər üçün (məsələn: articles)
    if (isPublicReq) {
      if (!PUBLIC_FOLDERS.has(folder)) {
        return NextResponse.json(
          { error: 'Bu qovluğa public yükləmə icazəsi yoxdur' },
          { status: 403 }
        );
      }
      // Public uploads only allow document type (no images!)
      if (kind !== 'document') {
        return NextResponse.json(
          { error: 'Public yükləmə yalnız sənəd faylları üçündür' },
          { status: 403 }
        );
      }
    } else {
      // Admin auth tələb olunur
      await requireAdmin();
    }

    const result = await uploadFile(file, folder, kind);
    return NextResponse.json({ ok: true, url: result.url });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Auth' }, { status: 401 });
    }
    console.error('Upload error:', e.message);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
