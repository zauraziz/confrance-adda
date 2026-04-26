export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

const ParticipantSchema = z.object({
  full_name: z.string().min(2).max(160),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  organization: z.string().max(255).optional().nullable(),
  position: z.string().max(160).optional().nullable(),
  participation_type: z.enum(['onsite', 'online', 'both']).default('onsite'),
  dietary_requirements: z.string().max(200).optional().nullable(),
  accommodation_needed: z.boolean().optional().default(false),
  language: z.enum(['az', 'en']).default('az'),
  notes: z.string().max(500).optional().nullable(),
});

function sanitize(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/<[^>]*>/g, '').trim();
}

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`participant:${ip}`, 3, 60 * 60 * 1000); // 3/hour
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çox sayda qeydiyyat cəhdi. 1 saat sonra yenidən cəhd edin.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = ParticipantSchema.parse(body);

    const clean = {
      ...data,
      full_name: sanitize(data.full_name),
      organization: sanitize(data.organization),
      position: sanitize(data.position),
      dietary_requirements: sanitize(data.dietary_requirements),
      notes: sanitize(data.notes),
    };

    const rows = await sql`
      INSERT INTO participants (full_name, email, phone, country, organization, position,
                                participation_type, dietary_requirements, accommodation_needed, language, notes)
      VALUES (${clean.full_name}, ${clean.email}, ${clean.phone || null}, ${clean.country || null},
              ${clean.organization || null}, ${clean.position || null}, ${clean.participation_type},
              ${clean.dietary_requirements || null}, ${clean.accommodation_needed}, ${clean.language},
              ${clean.notes || null})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e) {
    if (e.errors) {
      const msgs = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ error: msgs }, { status: 400 });
    }
    console.error('POST /api/participants:', e.message);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const rows = await sql`SELECT * FROM participants ORDER BY created_at DESC LIMIT 500`;
    return NextResponse.json({ items: rows });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: 'Server xətası', items: [] }, { status: 500 });
  }
}
