"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Award } from "lucide-react";
import { useLang } from "./LangProvider";
import { pick } from "@/lib/i18n";

export default function HomeAbout({ content = {} }) {
  const { lang, t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="relative py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" /> {t.aboutEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {pick(content.title, lang, t.aboutTitle)}
          </h2>
        </motion.div>

        <div className="mt-20 grid lg:grid-cols-2 gap-px bg-navy/10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }} className="bg-white p-10 lg:p-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-navy" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">1881</span>
            </div>
            <h3 className="font-display text-[28px] text-navy mb-4">{t.aboutLeftHead}</h3>
            <p className="text-[15px] leading-[1.75] text-ink/75">{pick(content.left_text, lang, t.aboutLeftText)}</p>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-navy/10">
              <Stat number="145" label={t.statYears} />
              <Stat number="12k+" label={t.statAlumni} />
              <Stat number="42" label={t.statCountries} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.1 }} className="bg-navy text-white p-10 lg:p-14 relative overflow-hidden">
            <svg className="absolute -right-10 -bottom-10 w-72 h-72 opacity-10" viewBox="0 0 200 200" fill="none">
              <path d="M0,100 Q50,60 100,100 T200,100" stroke="#c9a55a" strokeWidth="1" />
              <path d="M0,120 Q50,80 100,120 T200,120" stroke="#c9a55a" strokeWidth="1" />
              <path d="M0,140 Q50,100 100,140 T200,140" stroke="#c9a55a" strokeWidth="1" />
            </svg>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">1996 → 2026</span>
              </div>
              <h3 className="font-display text-[28px] mb-4">{t.aboutRightHead}</h3>
              <p className="text-[15px] leading-[1.75] text-white/80">{pick(content.right_text, lang, t.aboutRightText)}</p>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/15">
                <Stat number="30" label={t.statYears} gold />
                <Stat number="6" label={t.statFaculties} gold />
                <Stat number="1" label={t.statShip} gold />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label, gold }) {
  return (
    <div>
      <div className={`font-display text-[34px] leading-none ${gold ? "text-gold" : "text-navy"}`}>{number}</div>
      <div className={`text-[10.5px] tracking-[0.22em] uppercase mt-2 ${gold ? "text-white/60" : "text-ink/55"}`}>{label}</div>
    </div>
  );
}
