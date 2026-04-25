"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { useLang } from "./LangProvider";

export default function HomeProgramme({ schedule = { 1: [], 2: [], 3: [] } }) {
  const { lang, t } = useLang();
  const [day, setDay] = useState(1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const dayInfo = {
    1: { l: t.day1, d: t.day1Date },
    2: { l: t.day2, d: t.day2Date },
    3: { l: t.day3, d: t.day3Date },
  };

  return (
    <section id="programme" ref={ref} className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" /> {t.programmeEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {t.programmeTitle}
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-12">
          {[1, 2, 3].map(d => {
            const active = day === d;
            return (
              <button key={d} onClick={() => setDay(d)}
                      className={`flex items-center gap-4 pl-5 pr-7 py-4 rounded-full transition-all border ${
                        active ? "bg-navy text-white border-navy"
                               : "bg-transparent text-navy border-navy/15 hover:border-navy/40"
                      }`}>
                <span className={`font-display text-[20px] ${active ? "text-gold" : "text-navy"}`}>0{d}</span>
                <span className="text-left">
                  <span className="block text-[12px] tracking-[0.18em] uppercase font-semibold">{dayInfo[d].l}</span>
                  <span className={`block text-[11px] ${active ? "text-white/70" : "text-ink/55"}`}>{dayInfo[d].d}</span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}
                      className="border-t border-navy/10">
            {(schedule[day] || []).map((s, i) => (
              <motion.div key={s.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`grid grid-cols-12 gap-6 py-7 border-b border-navy/10 hover:bg-cream transition-colors ${
                            s.is_featured ? "bg-[#fdfaf2]" : ""
                          }`}>
                <div className="col-span-3 lg:col-span-2 pl-2">
                  <div className="font-display text-[28px] text-navy tabular-nums">{s.start_time}</div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 mt-1">
                    <Clock className="w-3 h-3 inline mr-1 -mt-0.5" /> {s.duration || 60} min
                  </div>
                </div>
                <div className="col-span-9 lg:col-span-8">
                  {s.is_featured && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-gold font-semibold mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {t.featured}
                    </div>
                  )}
                  <h3 className="font-display text-[22px] text-navy leading-snug">
                    {lang === "az" ? s.title_az : s.title_en}
                  </h3>
                  {(s.speaker_name_az || s.speaker_name_en) && (
                    <div className="mt-1 text-[13px] text-ink/65">
                      {lang === "az" ? s.speaker_name_az : s.speaker_name_en}
                    </div>
                  )}
                  {s.room && (
                    <div className="mt-2 flex items-center gap-2 text-[12.5px] text-ink/60">
                      <MapPin className="w-3.5 h-3.5" /> {s.room}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {(schedule[day] || []).length === 0 && (
              <div className="py-12 text-center text-ink/45 text-sm">{t.noSessions}</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
