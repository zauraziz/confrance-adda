'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminContent() {
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch('/api/content'); const j = await r.json();
    setContent(j.content || {});
  };
  useEffect(() => { load(); }, []);

  const update = (section, key, lang, value) => {
    setContent(c => ({ ...c, [section]: { ...c[section], [key]: { ...c[section][key], [lang]: value } } }));
  };

  const save = async () => {
    setSaving(true);
    const updates = [];
    Object.entries(content).forEach(([section, keys]) => {
      Object.entries(keys).forEach(([key, val]) => {
        updates.push({ section, key, value_az: val.az, value_en: val.en });
      });
    });
    await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    setSaving(false); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-navy">Sayt mətnləri</h1>
          <p className="text-sm text-ink/60 mt-1">Hero, About, Footer və digər bölmələrin mətnlərini buradan redaktə edin.</p>
        </div>
        <button onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40">
          <Save className="w-4 h-4" /> {saving ? 'Yadda saxlanılır…' : 'Hamısını yadda saxla'}
        </button>
      </div>

      {Object.entries(content).map(([section, keys]) => (
        <div key={section} className="bg-white rounded-2xl p-7 mb-5">
          <h3 className="font-display text-xl text-navy mb-5 capitalize">{section}</h3>
          <div className="space-y-5">
            {Object.entries(keys).map(([key, val]) => (
              <div key={key} className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{key} · AZ</span>
                  <textarea value={val.az || ''} onChange={e=>update(section,key,'az',e.target.value)} rows={2}
                            className="w-full border border-navy/15 focus:border-gold outline-none p-2.5 text-sm rounded-lg" />
                </label>
                <label className="block">
                  <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{key} · EN</span>
                  <textarea value={val.en || ''} onChange={e=>update(section,key,'en',e.target.value)} rows={2}
                            className="w-full border border-navy/15 focus:border-gold outline-none p-2.5 text-sm rounded-lg" />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
