"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useLang } from "./LangProvider";
import { pick } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } }),
};

export default function HomeHero({ content = {} }) {
  const { lang, t } = useLang();
  const target = useMemo(() => new Date("2026-06-15T09:00:00+04:00"), []);
  const { d, h, m, s } = useCountdown(target);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden text-white">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1494137148171-4f78b30e9be8?w=2400&q=80"
             alt="Caspian Sea" className="w-full h-full object-cover"
             onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/75 to-navy-dark" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top right, rgba(201,165,90,0.15), transparent 60%)" }} />
      </div>

      <svg className="absolute -right-40 -top-40 w-[700px] h-[700px] opacity-[0.07]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="58" stroke="white" strokeWidth="0.3" />
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i * 360 / 32) * Math.PI / 180;
          const x1 = 100 + Math.cos(a) * 60, y1 = 100 + Math.sin(a) * 60;
          const x2 = 100 + Math.cos(a) * 98, y2 = 100 + Math.sin(a) * 98;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.3" />;
        })}
      </svg>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div variants={fadeUp} initial="hidden" animate="show"
                    className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white/80">
          <span className="w-8 h-px bg-gold" /> {t.heroBadge}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-28 pt-10 grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                     className="font-display font-light leading-[0.92] text-balance"
                     style={{ fontSize: "clamp(48px, 7.5vw, 108px)" }}>
            {pick(content.title_a, lang, t.heroTitleA)}<br />
            <span className="italic font-normal">{pick(content.title_b, lang, t.heroTitleB)}</span><br />
            {pick(content.title_c, lang, t.heroTitleC)}
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                    className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80">
            {pick(content.subtitle, lang, t.heroSub)}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                      className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-7 py-4 rounded-full text-[13.5px] font-semibold transition-all">
              {t.submitArticle} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#about"
               className="inline-flex items-center gap-3 border border-white/30 hover:border-white px-7 py-4 rounded-full text-[13.5px] font-medium text-white/90 hover:text-white transition-all">
              {t.learnMore}
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:pl-8">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                      className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 rounded-3xl p-8 backdrop-blur-md">
            <div className="flex items-baseline gap-6">
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2">{t.plateMaritime}</div>
                <div className="font-display text-[110px] leading-none font-light text-white">145</div>
                <div className="text-[12px] tracking-wide text-white/70 mt-1">{t.plateYears145}</div>
              </div>
              <div className="w-px h-32 bg-white/15 self-end mb-4" />
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2">ADDA</div>
                <div className="font-display text-[110px] leading-none font-light text-white">30</div>
                <div className="text-[12px] tracking-wide text-white/70 mt-1">{t.plateYears30}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#000c24]/40 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/70">
            <Calendar className="w-4 h-4 text-gold" /> {t.heroDate}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 mr-2">{t.countdownTitle}</span>
            <Cell value={d} label={t.days} />
            <Cell value={h} label={t.hours} />
            <Cell value={m} label={t.minutes} />
            <Cell value={s} label={t.seconds} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[58px]">
      <div className="font-display text-[28px] leading-none text-white tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[9px] tracking-[0.25em] uppercase text-white/55 mt-1">{label}</div>
    </div>
  );
}

function useCountdown(target) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}
