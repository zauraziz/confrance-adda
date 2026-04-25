"use client";
import { useLang } from "./LangProvider";

export default function HomePartners({ partners = [] }) {
  const { lang } = useLang();
  if (partners.length === 0) return null;

  const byCategory = {};
  partners.forEach((p) => {
    const cat = p.category || "accreditation";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });

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
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
              {items.map((p) => {
                const content = p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="h-12 w-auto object-contain max-w-[160px]" />
                ) : (
                  <span className="font-display text-[22px] text-navy/70 tracking-tight">{p.name}</span>
                );
                return p.website_url ? (
                  <a key={p.id} href={p.website_url} target="_blank" rel="noopener noreferrer"
                     className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" title={p.name}>
                    {content}
                  </a>
                ) : (
                  <div key={p.id} className="opacity-60 hover:opacity-100 transition-opacity" title={p.name}>{content}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
