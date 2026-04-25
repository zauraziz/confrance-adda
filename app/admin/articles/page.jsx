'use client';
import { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Mail } from 'lucide-react';

export default function AdminArticles() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const load = async () => {
    const url = new URL('/api/articles', window.location.origin);
    if (filter) url.searchParams.set('status', filter);
    if (q) url.searchParams.set('q', q);
    const r = await fetch(url); const j = await r.json();
    setItems(j.items || []);
  };

  useEffect(() => { load(); }, [filter, q]);

  const updateStatus = async (id, status) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    setSelected(null); setNotes(''); load();
  };

  const STATUS = { pending: ['Gözləyir','bg-navy/8 text-navy'], accepted: ['Qəbul','bg-gold/15 text-gold-dark'], rejected: ['Rədd','bg-red-50 text-red-600'] };

  return (
    <div>
      <h1 className="font-display text-4xl text-navy mb-8">Məqalələr</h1>

      <div className="bg-white rounded-2xl">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-navy/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Müəllif və ya başlıq…"
                   className="w-full pl-9 pr-4 py-2 bg-cream rounded-full text-sm outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          <div className="flex gap-1 bg-cream rounded-full p-1">
            {[['','Hamısı'],['pending','Gözləyən'],['accepted','Qəbul'],['rejected','Rədd']].map(([v,l]) => (
              <button key={v} onClick={()=>setFilter(v)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${filter===v?'bg-navy text-white':'text-ink/55'}`}>{l}</button>
            ))}
          </div>
        </div>

        <table className="w-full">
          <thead className="text-[10.5px] tracking-[0.18em] uppercase text-ink/50">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Müəllif</th>
              <th className="text-left px-6 py-3 font-semibold">Başlıq</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-left px-6 py-3 font-semibold">Tarix</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id} className="border-t border-navy/[0.06] hover:bg-cream/40">
                <td className="px-6 py-3.5">
                  <div className="font-medium text-navy text-sm">{a.full_name}</div>
                  <div className="text-xs text-ink/50">{a.email}</div>
                </td>
                <td className="px-6 py-3.5 text-sm text-ink/75 max-w-md truncate">{a.title}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS[a.status][1]}`}>{STATUS[a.status][0]}</span>
                </td>
                <td className="px-6 py-3.5 text-xs text-ink/60">{new Date(a.created_at).toLocaleDateString('az-AZ')}</td>
                <td className="px-6 py-3.5">
                  <button onClick={()=>{setSelected(a);setNotes(a.admin_notes||'');}}
                          className="w-8 h-8 rounded-lg hover:bg-navy/5 text-navy/60 hover:text-navy flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-ink/45 text-sm">Məqalə tapılmadı</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e=>e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl text-navy">{selected.title}</h3>
                <p className="text-sm text-ink/60 mt-1">{selected.full_name} · {selected.organization}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-ink/40"><X className="w-5 h-5" /></button>
            </div>

            <div className="text-sm space-y-3 mb-6">
              <div className="flex"><span className="w-32 text-ink/55">E-poçt:</span><a href={`mailto:${selected.email}`} className="text-navy hover:text-gold flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</a></div>
              <div className="flex"><span className="w-32 text-ink/55">Telefon:</span>{selected.phone}</div>
              <div className="flex"><span className="w-32 text-ink/55">Mövzu:</span>{selected.topic_area}</div>
              <div className="flex"><span className="w-32 text-ink/55">Açar sözlər:</span>{selected.keywords}</div>
            </div>

            <div className="mb-6">
              <div className="text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">Annotasiya</div>
              <div className="bg-cream rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">{selected.abstract}</div>
            </div>

            <label className="block mb-6">
              <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">Admin qeydləri (müəllifə göndəriləcək)</span>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3}
                        className="w-full border border-navy/15 focus:border-gold outline-none p-3 text-sm rounded-lg" />
            </label>

            <div className="flex gap-3">
              <button onClick={()=>updateStatus(selected.id, 'accepted')}
                      className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink px-5 py-2.5 rounded-full text-sm font-semibold">
                <Check className="w-4 h-4" /> Qəbul et və e-poçt göndər
              </button>
              <button onClick={()=>updateStatus(selected.id, 'rejected')}
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-full text-sm font-semibold">
                <X className="w-4 h-4" /> Rədd et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
