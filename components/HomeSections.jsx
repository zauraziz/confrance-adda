"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "./LangProvider";

export default function HomeSections({ sections = [] }) {
  const { lang } = useLang();
  const isAz = lang === "az";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // Default 6 sections (proqram faylına uyğun)
  const defaults = [
    {
      id: 1, number: 1,
      title_az: "İnnovativ gəmiqayırma və gəmi təmiri texnologiyaları",
      title_en: "Innovative Shipbuilding and Ship Repair Technologies",
      description_az: "Rəqəmsal dizayn və modelləşdirmə. Ağıllı istehsalat (Sənaye 4.0). Yeni materiallar və kompozitlər. Yaşıl gəmiqayırma texnologiyaları.",
      description_en: "Digital design and modeling. Smart manufacturing (Industry 4.0). New materials and composites. Green shipbuilding technologies.",
    },
    {
      id: 2, number: 2,
      title_az: "Gəmiçilikdə süni intellekt və rəqəmsallaşma",
      title_en: "AI and Digitalization in Shipping",
      description_az: "Avtomatlaşdırılmış və avtonom gəmilər. Avtonom naviqasiya və ağıllı gəmilər. Gəmiçilikdə rəqəmsallaşma. Dəniz nəqliyyatında təhlükəsizlik və səmərəlilik.",
      description_en: "Automated and autonomous vessels. Autonomous navigation and smart ships. Digitalization in shipping. Safety and efficiency in maritime transport.",
    },
    {
      id: 3, number: 3,
      title_az: "Gəmi enerji sistemləri, avtomatika və texniki sistemlər",
      title_en: "Ship Power, Automation and Technical Systems",
      description_az: "Gəmi enerji sistemlərinin istismarı. Elektrotexniki komplekslərin idarə edilməsi və enerji səmərəliliyi. Hibrid texnologiyalar və bərpa olunan enerji mənbələri. Funksional təhlükəsizlik və intellektual diaqnostika.",
      description_en: "Operation of ship power systems. Management of electrotechnical complexes and energy efficiency. Hybrid technologies and renewable energy sources. Functional safety and intelligent diagnostics.",
    },
    {
      id: 4, number: 4,
      title_az: "Dənizçilik sənayesində fundamental elmlər və müasir ekoloji çağırışlar",
      title_en: "Fundamental Sciences and Modern Environmental Challenges in Maritime Industry",
      description_az: "Dəniz mühiti və iqlim dəyişikliyi. Gəmiçilikdə ekoloji təhlükəsizlik. Mexanika və fundamental elmlərin gəmiçilikdə tətbiqi. Dayanıqlı dəniz ekosistemləri.",
      description_en: "Marine environment and climate change. Environmental safety in shipping. Application of mechanics and fundamental sciences in shipping. Sustainable marine ecosystems.",
    },
    {
      id: 5, number: 5,
      title_az: "Dəniz nəqliyyatının iqtisadiyyatı və logistikası",
      title_en: "Economics and Logistics of Maritime Transport",
      description_az: "Dəniz nəqliyyatı logistikasında rəqəmsallaşma. Qlobal logistika və təchizat zənciri. Liman terminalları və əməliyyatlar. Dəniz nəqliyyatında risklərin idarə edilməsi.",
      description_en: "Digitalization in maritime transport logistics. Global logistics and supply chain. Port terminals and operations. Risk management in maritime transport.",
    },
    {
      id: 6, number: 6,
      title_az: "Qlobal gəmiçilikdə hüquqi, humanitar və dil çağırışları",
      title_en: "Legal, Humanitarian and Language Challenges in Global Shipping",
      description_az: "Dəniz hüququnun inkişaf tendensiyaları. Beynəlxalq gəmiçiliyin humanitar problemləri. Dəniz nəqliyyatında dil və terminologiya məsələləri.",
      description_en: "Development trends of maritime law. Humanitarian challenges of global shipping. Language and terminology issues in maritime transport.",
    },
  ];

  // De-duplicate by `number` to prevent doubles from DB
  const seen = new Set();
  const unique = [];
  (sections.length > 0 ? sections : defaults).forEach(s => {
    if (!seen.has(s.number)) {
      seen.add(s.number);
      unique.push(s);
    }
  });
  // Sort by number ascending
  unique.sort((a, b) => (a.number || 0) - (b.number || 0));

  return (
    <section id="sections" ref={ref} className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" />
            {isAz ? "Elmi istiqamətlər" : "Scientific sections"}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {isAz ? "Konfransın bölmələri" : "Conference sections"}
          </h2>
          <p className="mt-6 text-[15px] text-ink/70 max-w-lg">
            {isAz
              ? "Altı elmi istiqamətdə peer-review prosesindən keçən məqalələr qəbul olunur."
              : "Peer-reviewed papers are accepted across six scientific tracks."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10">
          {unique.map((s, i) => (
            <motion.div key={s.id || s.number} initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        className="bg-white p-8 hover:bg-cream transition-colors group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-5xl text-gold leading-none">0{s.number}</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-ink/40">
                  {isAz ? "Bölmə" : "Section"}
                </span>
              </div>
              <h3 className="font-display text-[20px] text-navy mb-4 leading-tight group-hover:text-navy-deep transition-colors">
                {isAz ? s.title_az : s.title_en}
              </h3>
              <p className="text-[13.5px] text-ink/70 leading-relaxed">
                {isAz ? s.description_az : s.description_en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
