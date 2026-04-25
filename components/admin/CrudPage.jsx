"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

export default function CrudPage({ title, endpoint, fields, columns }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const r = await fetch(endpoint);
    const j = await r.json();
    setItems(j.items || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const isNew = !editing.id;
    const url = isNew ? endpoint : `${endpoint}/${editing.id}`;
    const method = isNew ? "POST" : "PATCH";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (r.ok) { setEditing(null); load(); }
  };

  const remove = async (id) => {
    if (!confirm("Silinsin?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl text-navy">{title}</h1>
        <button onClick={() => setEditing({})}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-5 py-2.5 rounded-full text-sm font-semibold">
          <Plus className="w-4 h-4" /> Yeni əlavə et
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream text-[10.5px] tracking-[0.18em] uppercase text-ink/55">
            <tr>
              {columns.map(c => <th key={c.key} className="text-left px-6 py-4 font-semibold">{c.label}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t border-navy/[0.06] hover:bg-cream/40">
                {columns.map(c => (
                  <td key={c.key} className="px-6 py-3.5 text-sm text-ink/80">
                    {c.render ? c.render(it) : it[c.key]}
                  </td>
                ))}
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => setEditing(it)}
                          className="w-8 h-8 rounded-lg hover:bg-navy/5 text-navy/60 hover:text-navy inline-flex items-center justify-center mr-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(it.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 text-navy/60 hover:text-red-500 inline-flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-12 text-ink/45 text-sm">Heç bir məlumat yoxdur</div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
             onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-navy">{editing.id ? "Redaktə et" : "Yeni əlavə et"}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-ink/40" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {fields.map(f => {
                const span = f.full ? "sm:col-span-2" : "";
                if (f.type === "textarea") return (
                  <label key={f.key} className={`block ${span}`}>
                    <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{f.label}</span>
                    <textarea rows={f.rows || 4} value={editing[f.key] || ""}
                              onChange={e => setEditing({ ...editing, [f.key]: e.target.value })}
                              className="w-full border border-navy/15 focus:border-gold outline-none p-3 text-sm rounded-lg" />
                  </label>
                );
                if (f.type === "checkbox") return (
                  <label key={f.key} className={`flex items-center gap-2 ${span}`}>
                    <input type="checkbox" checked={!!editing[f.key]}
                           onChange={e => setEditing({ ...editing, [f.key]: e.target.checked })}
                           className="w-4 h-4 accent-[#c9a55a]" />
                    <span className="text-sm">{f.label}</span>
                  </label>
                );
                return (
                  <label key={f.key} className={`block ${span}`}>
                    <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{f.label}</span>
                    <input type={f.type || "text"} value={editing[f.key] || ""}
                           onChange={e => setEditing({ ...editing, [f.key]: e.target.value })}
                           className="w-full border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
                  </label>
                );
              })}
            </div>
            <button onClick={save}
                    className="mt-8 inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-7 py-3 rounded-full text-sm font-semibold">
              <Save className="w-4 h-4" /> Yadda saxla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
