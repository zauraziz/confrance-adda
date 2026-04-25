"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useLang } from "./LangProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } }),
};

export default function HomeHero({ content = {}, settings = {} }) {
  const { lang, t } = useLang();
  const isAz = lang === "az";

  const startDate = settings.conference_start_date || "2026-10-29";
  const endDate = settings.conference_end_date || "2026-10-30";
  const venue = isAz
    ? (settings.conference_venue_az || "Baku Marriott Hotel Boulevard")
    : (settings.conference_venue_en || "Baku Marriott Hotel Boulevard");

  const target = useMemo(() => new Date(`${startDate}T09:00:00+04:00`), [startDate]);
  const { d, h, m, s } = useCountdown(target);

  const dateLabel = isAz
    ? `29–30 Oktyabr 2026  ·  Bakı, Azərbaycan`
    : `29–30 October 2026  ·  Baku, Azerbaijan`;

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden text-white">
      <div className="absolute inset-0">
        <img src={settings.hero_image_url || "https://images.unsplash.com/photo-1494137148171-4f78b30e9be8?w=2400&q=80"}
             alt="Caspian Sea" className="w-full h-full object-cover"
             onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/75 to-navy-dark" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top right, rgba(201,165,90,0.15), transparent 60%)" }} />
      </div>

      {/* Compass rose decoration */}
      <svg className="absolute -right-40 -top-40 w-[700px] h-[700px] opacity-[0.07]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="58" stroke="white" strokeWidth="0.3" />
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i * 360 / 32) * Math.PI / 180;
          return <line key={i} x1={100 + Math.cos(a) * 60} y1={100 + Math.sin(a) * 60}
                       x2={100 + Math.cos(a) * 98} y2={100 + Math.sin(a) * 98}
                       stroke="white" strokeWidth="0.3" />;
        })}
      </svg>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div variants={fadeUp} initial="hidden" animate="show"
                    className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white/80">
          <span className="w-8 h-px bg-gold" />
          {isAz ? "Beynəlxalq Elmi-Praktiki Konfrans" : "International Scientific-Practical Conference"}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-28 pt-10 grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                     className="font-display font-light leading-[0.92] text-balance"
                     style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
            {isAz ? (
              <>
                İnnovativ<br />
                <span className="italic font-normal">Dənizçilik</span> və<br />
                Dayanıqlı İnkişaf
              </>
            ) : (
              <>
                Innovative<br />
                <span className="italic font-normal">Maritime</span> and<br />
                Sustainable Development
              </>
            )}
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                    className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80">
            {isAz
              ? "Azərbaycanda dənizçilik təhsilinin 145 illiyi və ADDA-nın 30 illiyi münasibətilə keçirilən beynəlxalq forum. On altı ölkədən nazirlər, admirallar və akademik şəxsiyyətlər."
              : "Marking 145 years of maritime education in Azerbaijan and the 30th anniversary of ADDA — a convening of admirals, ministers and the next generation of seafarers from sixteen nations."
            }
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                      className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-7 py-4 rounded-full text-[13.5px] font-semibold transition-all">
              {isAz ? "Məqalə göndər" : "Submit article"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/register"
                  className="inline-flex items-center gap-3 border border-white/30 hover:border-white px-7 py-4 rounded-full text-[13.5px] font-medium text-white/90 hover:text-white transition-all">
              {isAz ? "Qeydiyyatdan keç" : "Register to attend"}
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:pl-8">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                      className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 rounded-3xl p-8 backdrop-blur-md">
            <div className="flex items-baseline gap-6">
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2">
                  {isAz ? "Dənizçilik təhsili" : "Maritime education"}
                </div>
                <div className="font-display text-[100px] leading-none font-light text-white">145</div>
                <div className="text-[12px] tracking-wide text-white/70 mt-1">
                  {isAz ? "il · 1881–2026" : "years · 1881–2026"}
                </div>
              </div>
              <div className="w-px h-28 bg-white/15 self-end mb-4" />
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2">ADDA</div>
                <div className="font-display text-[100px] leading-none font-light text-white">30</div>
                <div className="text-[12px] tracking-wide text-white/70 mt-1">
                  {isAz ? "il · 1996–2026" : "years · 1996–2026"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Countdown bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#000c24]/40 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/70">
            <Calendar className="w-4 h-4 text-gold" /> {dateLabel}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 mr-2">
              {isAz ? "Konfransa qalıb" : "Conference begins in"}
            </span>
            <Cell value={d} label={isAz ? "Gün" : "Days"} />
            <Cell value={h} label={isAz ? "Saat" : "Hours"} />
            <Cell value={m} label={isAz ? "Dəqiqə" : "Min"} />
            <Cell value={s} label={isAz ? "Saniyə" : "Sec"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[54px]">
      <div className="font-display text-[26px] leading-none text-white tabular-nums">{String(value).padStart(2, "0")}</div>
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
