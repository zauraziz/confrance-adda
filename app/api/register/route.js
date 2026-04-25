import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Formadan gələn məlumatları qəbul edirik
    const { full_name, email, phone, organization } = await request.json();

    // Məlumatları bazadakı participants cədvəlinə yazırıq
    await sql`
      INSERT INTO participants (full_name, email, phone, organization)
      VALUES (${full_name}, ${email}, ${phone}, ${organization})
    `;

    // Uğurlu cavab qaytarırıq
    return NextResponse.json({ message: 'Qeydiyyat uğurludur' }, { status: 200 });
  } catch (error) {
    console.error('Baza xətası:', error);
    return NextResponse.json({ error: 'Məlumat bazaya yazıla bilmədi' }, { status: 500 });
  }
}
