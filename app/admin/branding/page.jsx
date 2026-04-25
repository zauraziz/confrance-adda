"use client";
import { useState, useEffect } from "react";
import { Upload, Save, Image as ImageIcon, Loader2 } from "lucide-react";

export default function BrandingPage() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);

  const load = async () => {
    const r = await fetch('/api/settings'); const j = await r.json();
    const map = {}; (j.items || []).forEach(s => map[s.key] = s.value); setSettings(map);
  };
  useEffect(() => { load(); }, []);

  const uploadImage = async (key, file) => {
    setUploading(key);
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('folder', 'branding'); fd.append('kind', 'image');
      const r = await fetch('/api/upload', { method: 'POST', body: fd }); const j = await r.json();
      if (!r.ok) throw new Error(j.error); setSettings(s => ({ ...s, [key]: j.url }));
    } catch (e) { alert('Xəta: ' + e.message); } finally { setUploading(null); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
      alert('Yadda saxlanıldı');
    } catch (e) { alert('Xəta: ' + e.message); } finally { setSaving(false); }
  };

  const imageFields = [
    { key: 'logo_url', label: 'Konfrans logosu', hint: 'SVG və ya PNG, 300x80' },
    { key: 'hero_image_url', label: 'Hero fon şəkli', hint: 'Landscape, min. 1920x1080' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-4xl text-navy">Brendinq</h1><p className="text-ink/60 mt-1">Logo və fon şəkillərini idarə edin</p></div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40">
          <Save className="w-4 h-4" /> {saving ? 'Saxlanılır…' : 'Yadda saxla'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {imageFields.map(f => (
          <div key={f.key} className="bg-white rounded-2xl p-7">
            <h3 className="font-display text-xl text-navy mb-2">{f.label}</h3>
            <p className="text-xs text-ink/55 mb-5">{f.hint}</p>
            <div className="bg-cream rounded-xl p-6 mb-4 min-h-[140px] flex items-center justify-center">
              {settings[f.key] ? <img src={settings[f.key]} alt={f.label} className="max-h-32 max-w-full object-contain" /> : <ImageIcon className="w-12 h-12 text-ink/20" />}
            </div>
            <label className="block"><input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(f.key, e.target.files[0])} />
              <span className={'block w-full text-center py-2.5 rounded-full text-sm font-semibold cursor-pointer border-2 border-dashed ' + (uploading === f.key ? 'border-gold bg-gold/10 text-gold-dark' : 'border-navy/20 text-navy hover:border-navy')}>
                {uploading === f.key ? <><Loader2 className="w-4 h-4 inline animate-spin mr-2" />Yüklənir...</> : <><Upload className="w-4 h-4 inline mr-2" />Şəkil yüklə</>}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
