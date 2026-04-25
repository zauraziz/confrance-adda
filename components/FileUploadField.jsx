"use client";
import { useState } from "react";
import { Upload, File, X, Loader2 } from "lucide-react";

export default function FileUploadField({ label, value, onChange, accept = ".pdf,.doc,.docx", maxSizeMB = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return; setError('');
    if (file.size > maxSizeMB * 1024 * 1024) { setError('Fayl ' + maxSizeMB + ' MB-dan böyükdür'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('folder', 'articles'); fd.append('kind', 'document'); fd.append('public', 'true');
      const r = await fetch('/api/upload', { method: 'POST', body: fd }); const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Yükləmə uğursuz'); onChange({ url: j.url, name: file.name });
    } catch (e) { setError(e.message); } finally { setUploading(false); }
  };
  return (
    <div>
      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{label}</span>
      {value?.url ? (
        <div className="flex items-center justify-between p-3 bg-cream rounded-lg border border-navy/10">
          <div className="flex items-center gap-2 min-w-0"><File className="w-4 h-4 text-gold shrink-0" /><span className="text-sm text-navy truncate">{value.name}</span></div>
          <button onClick={() => onChange(null)} className="text-ink/40 hover:text-red-500"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <label className="block cursor-pointer"><input type="file" accept={accept} className="hidden" onChange={handle} />
          <div className={'flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed text-sm ' + (uploading ? 'border-gold bg-gold/5 text-gold-dark' : 'border-navy/20 text-navy/60 hover:border-navy/40')}>
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Yüklənir...</> : <><Upload className="w-4 h-4" /> Fayl seç (maks. {maxSizeMB} MB)</>}
          </div>
        </label>
      )}
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
    </div>
  );
}
