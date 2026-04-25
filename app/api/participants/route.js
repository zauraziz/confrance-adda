export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

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

export async function POST(req) {
  try {
    const body = await req.json();
    const data = ParticipantSchema.parse(body);

    const rows = await sql`
      INSERT INTO participants (full_name, email, phone, country, organization, position,
                                participation_type, dietary_requirements, accommodation_needed, language, notes)
      VALUES (${data.full_name}, ${data.email}, ${data.phone || null}, ${data.country || null},
              ${data.organization || null}, ${data.position || null}, ${data.participation_type},
              ${data.dietary_requirements || null}, ${data.accommodation_needed}, ${data.language},
              ${data.notes || null})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e) {
    if (e.errors) return NextResponse.json({ error: e.errors }, { status: 400 });
    console.error('POST /api/participants:', e.message);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await requireAdmin();
    const rows = await sql`SELECT * FROM participants ORDER BY created_at DESC`;
    return NextResponse.json({ items: rows });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Auth' }, { status: 401 });
    return NextResponse.json({ error: 'Server xətası', items: [] }, { status: 500 });
  }
}
