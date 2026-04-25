"use client";
import { useState, useEffect } from "react";
import { Save, Calendar, MapPin, Type, Settings } from "lucide-react";

export default function SettingsPage() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const load = async () => { const r = await fetch('/api/settings'); const j = await r.json(); setItems(j.items || []); };
  useEffect(() => { load(); }, []);
  const update = (key, value) => setItems(s => s.map(i => i.key === key ? { ...i, value } : i));
  const save = async () => {
    setSaving(true);
    try { await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items.map(i => ({ key: i.key, value: i.value }))) }); alert('Yadda saxlanıldı'); }
    catch (e) { alert('Xəta: ' + e.message); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-4xl text-navy">Tənzimləmələr</h1><p className="text-ink/60 mt-1">Tarixlər bir yerdə — bütün saytda yenilənir</p></div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40">
          <Save className="w-4 h-4" /> {saving ? 'Saxlanılır…' : 'Hamısını yadda saxla'}
        </button>
      </div>
      <div className="bg-white rounded-2xl p-7">
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(item => (
            <label key={item.key} className="block">
              <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{item.label_az || item.key}</span>
              <input type={item.value_type === 'date' ? 'date' : item.value_type === 'number' ? 'number' : 'text'}
                     value={item.value || ''} onChange={e => update(item.key, e.target.value)}
                     className="w-full border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
