"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "./LangProvider";

export default function HomeSections({ sections = [] }) {
  const { lang } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  if (sections.length === 0) return null;

  return (
    <section id="sections" ref={ref} className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" />
            {lang === "az" ? "Elmi istiqamətlər" : "Scientific sections"}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {lang === "az" ? "Konfransın bölmələri" : "Conference sections"}
          </h2>
          <p className="mt-6 text-[15px] text-ink/70 max-w-lg">
            {lang === "az"
              ? "Altı elmi istiqamətdə peer-review prosesindən keçən məqalələr qəbul olunur."
              : "Peer-reviewed papers are accepted across six scientific tracks."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10">
          {sections.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        className="bg-white p-8 hover:bg-cream transition-colors group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-5xl text-gold leading-none">0{s.number}</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-ink/40">
                  {lang === "az" ? "Bölmə" : "Section"}
                </span>
              </div>
              <h3 className="font-display text-[20px] text-navy mb-4 leading-tight group-hover:text-navy-deep transition-colors">
                {lang === "az" ? s.title_az : s.title_en}
              </h3>
              <p className="text-[13.5px] text-ink/70 leading-relaxed">
                {lang === "az" ? s.description_az : s.description_en}
              </p>
              {s.chairs && (
                <div className="mt-5 pt-4 border-t border-navy/10">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 mb-1">
                    {lang === "az" ? "Həmsədrlər" : "Chairs"}
                  </div>
                  <div className="text-[12.5px] text-navy/80">{s.chairs}</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
