import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL or POSTGRES_URL is not set');
}

export const sql = neon(connectionString);

/* ============ Köməkçi sorğular ============ */

export async function getSpeakers() {
  const rows = await sql`SELECT * FROM speakers ORDER BY sort_order, name_en`;
  return rows;
}

export async function getSpeakerBySlug(slug) {
  const rows = await sql`SELECT * FROM speakers WHERE slug = ${slug} LIMIT 1`;
  return rows[0] || null;
}

export async function getSessionsByDay(day) {
  const rows = await sql`
    SELECT s.*,
           sp.name_az AS speaker_name_az,
           sp.name_en AS speaker_name_en,
           sp.slug    AS speaker_slug
    FROM sessions s
    LEFT JOIN speakers sp ON sp.id = s.speaker_id
    WHERE s.day_number = ${day}
    ORDER BY s.start_time, s.sort_order
  `;
  return rows;
}

export async function getPageBySlug(slug) {
  const rows = await sql`
    SELECT * FROM pages
    WHERE slug = ${slug} AND is_published = true
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function getMenuPages() {
  const rows = await sql`
    SELECT slug, title_az, title_en
    FROM pages
    WHERE is_published = true AND show_in_menu = true
    ORDER BY sort_order
  `;
  return rows;
}

export async function getSiteContent() {
  const rows = await sql`SELECT section, key, value_az, value_en FROM site_content`;
  const content = {};
  rows.forEach(r => {
    content[r.section] = content[r.section] || {};
    content[r.section][r.key] = { az: r.value_az, en: r.value_en };
  });
  return content;
}
