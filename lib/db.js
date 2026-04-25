import { neon } from '@neondatabase/serverless';

let _sql = null;

function getSql() {
  if (_sql) return _sql;
  const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!cs) {
    // Build zamanı DB yoxdursa, boş nəticə qaytaran proxy
    return (strings, ...values) => Promise.resolve([]);
  }
  _sql = neon(cs);
  return _sql;
}

export const sql = (strings, ...values) => getSql()(strings, ...values);

export async function getSpeakers() {
  try { return await sql`SELECT * FROM speakers ORDER BY sort_order, name_en`; }
  catch (e) { console.error('getSpeakers:', e.message); return []; }
}

export async function getSpeakerBySlug(slug) {
  try { const rows = await sql`SELECT * FROM speakers WHERE slug = ${slug} LIMIT 1`; return rows[0] || null; }
  catch (e) { return null; }
}

export async function getSessionsByDay(day) {
  try {
    return await sql`SELECT s.*, sp.name_az AS speaker_name_az, sp.name_en AS speaker_name_en, sp.slug AS speaker_slug
      FROM sessions s LEFT JOIN speakers sp ON sp.id = s.speaker_id
      WHERE s.day_number = ${day} ORDER BY s.start_time, s.sort_order`;
  } catch (e) { return []; }
}

export async function getPageBySlug(slug) {
  try { const rows = await sql`SELECT * FROM pages WHERE slug = ${slug} AND is_published = true LIMIT 1`; return rows[0] || null; }
  catch (e) { return null; }
}

export async function getMenuPages() {
  try { return await sql`SELECT slug, title_az, title_en FROM pages WHERE is_published = true AND show_in_menu = true ORDER BY sort_order`; }
  catch (e) { return []; }
}

export async function getSiteContent() {
  try {
    const rows = await sql`SELECT section, key, value_az, value_en FROM site_content`;
    const c = {}; rows.forEach(r => { c[r.section] = c[r.section] || {}; c[r.section][r.key] = { az: r.value_az, en: r.value_en }; });
    return c;
  } catch (e) { return {}; }
}
