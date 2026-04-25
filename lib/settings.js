import { sql } from '@/lib/db';
let _cache = null;
let _cacheTime = 0;

export async function getAllSettings() {
  try {
    if (_cache && (Date.now() - _cacheTime < 30000)) return _cache;
    const rows = await sql`SELECT key, value, value_type FROM site_settings`;
    const s = {};
    rows.forEach(r => { let v = r.value; if (r.value_type === 'number') v = Number(v); s[r.key] = v; });
    _cache = s; _cacheTime = Date.now();
    return s;
  } catch (e) { console.error('getAllSettings:', e.message); return {}; }
}

export async function updateSetting(key, value) {
  await sql`INSERT INTO site_settings (key, value, updated_at) VALUES (${key}, ${String(value)}, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
  _cache = null;
}
