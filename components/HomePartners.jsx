"use client";
import { useLang } from "./LangProvider";

export default function HomePartners({ partners = [] }) {
  const { lang } = useLang();
  const isAz = lang === "az";

  // Default akkreditasiya tərəfdaşları
  const defaults = [
    { id: 1, name: "IMO", category: "accreditation", website_url: "https://www.imo.org" },
    { id: 2, name: "IAMU", category: "accreditation", website_url: "https://iamu-edu.org" },
    { id: 3, name: "Lloyd's Register", category: "accreditation", website_url: "https://www.lr.org" },
    { id: 4, name: "ClassNK", category: "accreditation", website_url: "https://www.classnk.or.jp" },
    { id: 5, name: "BIMCO", category: "accreditation", website_url: "https://www.bimco.org" },
    { id: 6, name: "DNV", category: "accreditation", website_url: "https://www.dnv.com" },
  ];

  // De-duplicate by name (case-insensitive)
  const seen = new Set();
  const unique = [];
  (partners.length > 0 ? partners : defaults).forEach(p => {
    const key = (p.name || "").trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  });

  // Group by category
  const byCategory = {};
  unique.forEach(p => {
    const cat = p.category || "accreditation";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });

  if (unique.length === 0) return null;

  const labels = {
    accreditation: { az: "Akkreditasiya tərəfdaşları", en: "Accreditation partners" },
    sponsor: { az: "Sponsorlar", en: "Sponsors" },
    media: { az: "Media tərəfdaşları", en: "Media partners" },
  };

  return (
    <section className="py-20 bg-cream border-y border-navy/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="mb-12 last:mb-0">
            <div className="text-[10px] tracking-[0.3em] uppercase text-navy/50 mb-8 text-center">
              {(labels[cat] || labels.accreditation)[lang]}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:gap-x-16">
              {items.map(p => {
                const inner = p.logo_url ? (
                  <img src={p.logo_url} alt={p.name}
                       className="h-10 lg:h-12 w-auto object-contain max-w-[160px]" />
                ) : (
                  <span className="font-display text-[20px] lg:text-[22px] text-navy/70 tracking-tight">
                    {p.name}
                  </span>
                );
                return p.website_url ? (
                  <a key={p.id} href={p.website_url} target="_blank" rel="noopener noreferrer"
                     className="opacity-60 hover:opacity-100 transition-all" title={p.name}>
                    {inner}
                  </a>
                ) : (
                  <div key={p.id} className="opacity-60 hover:opacity-100 transition-opacity" title={p.name}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
