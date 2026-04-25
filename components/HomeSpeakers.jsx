"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "./LangProvider";

const ACCENTS = ["from-gold to-gold-dark", "from-navy-deep to-navy-dark"];
const initials = (name) => (name || "").split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("");

export default function HomeSpeakers({ speakers = [] }) {
  const { lang, t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="speakers" ref={ref} className="py-32 bg-cream relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" /> {t.speakersEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {t.speakersTitle}
          </h2>
          <p className="mt-6 text-[15px] text-ink/70 max-w-lg">{t.speakersSub}</p>
        </motion.div>

        {speakers.length === 0 ? (
          <div className="text-center py-16 text-ink/45">
            {lang === "az" ? "Tezliklə spikerlər siyahısı dərc olunacaq." : "Speaker list coming soon."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10">
            {speakers.map((sp, i) => {
              const name = lang === "az" ? sp.name_az : sp.name_en;
              const role = lang === "az" ? sp.role_az : sp.role_en;
              return (
                <motion.div key={sp.id || sp.slug} initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.06 }}>
                  <Link href={`/speakers/${sp.slug}`}
                        className="group bg-white p-8 hover:bg-navy transition-all duration-500 relative block h-full">
                    {sp.photo_url ? (
                      <img src={sp.photo_url} alt={name} className="w-20 h-20 rounded-full object-cover mb-6" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${ACCENTS[i % 2]} flex items-center justify-center text-white font-display text-[24px] mb-6`}>
                        {initials(sp.name_en || sp.name_az)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-ink/50 group-hover:text-gold mb-3 transition-colors">
                      {sp.country} · {t.speakerLabel}
                    </div>
                    <h3 className="font-display text-[22px] text-navy group-hover:text-white transition-colors leading-tight">{name}</h3>
                    <p className="mt-2 text-[13.5px] text-ink/70 group-hover:text-white/75 transition-colors">{role}</p>
                    <div className="mt-8 pt-6 border-t border-navy/10 group-hover:border-white/15 transition-colors flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-ink/40 group-hover:text-white/50 transition-colors">{t.viewProfile}</span>
                      <ArrowRight className="w-4 h-4 text-navy group-hover:text-gold transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
