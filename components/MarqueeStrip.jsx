"use client";
import { useLang } from "./LangProvider";

export default function MarqueeStrip({ items = [] }) {
  const { lang } = useLang();

  // Default items (fallback if DB-də yoxdur)
  const defaults = [
    { text_az: "145 + 30", text_en: "145 + 30", style: "display" },
    { text_az: "◆", text_en: "◆", style: "separator" },
    { text_az: "Xəzər · Beynəlxalq · Akademik", text_en: "Caspian · International · Academic", style: "text" },
    { text_az: "◆", text_en: "◆", style: "separator" },
    { text_az: "İnnovativ Dənizçilik", text_en: "Innovative Maritime", style: "display" },
    { text_az: "◆", text_en: "◆", style: "separator" },
    { text_az: "Bakı · 29-30 Oktyabr 2026", text_en: "Baku · 29-30 October 2026", style: "text" },
    { text_az: "◆", text_en: "◆", style: "separator" },
  ];

  const list = items.length > 0 ? items : defaults;

  return (
    <div className="bg-navy text-white py-8 overflow-hidden">
      <div className="flex items-center gap-12 whitespace-nowrap"
           style={{ animation: "adda-marquee 50s linear infinite" }}>
        {Array.from({ length: 4 }).map((_, k) => (
          <div key={k} className="flex items-center gap-12 shrink-0">
            {list.map((item, i) => {
              const text = lang === "az" ? item.text_az : item.text_en;
              if (item.style === "separator") {
                return <span key={i} className="text-gold">{text}</span>;
              }
              if (item.style === "display") {
                return <span key={i} className="font-display text-[36px] font-light italic">{text}</span>;
              }
              return <span key={i} className="text-[12px] tracking-[0.3em] uppercase">{text}</span>;
            })}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes adda-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
