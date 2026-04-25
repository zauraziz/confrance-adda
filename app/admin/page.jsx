"use client";

/* =============================================================================
   ADDA Konfrans — Əsas səhifə (Single-file Next.js 14 App Router page)
   Path: app/page.jsx

   Bu fayl bütün ictimai səhifə komponentlərini özündə saxlayır:
   - Sticky header + AZ/EN dil toggle + mobil menyu
   - Hero (145/30 plakası + countdown timer)
   - Marquee strip
   - About bölməsi
   - Speakers grid (hər biri /speakers/[slug] səhifəsinə keçid)
   - Programme (3 günlük tabbed schedule)
   - Submit Article CTA bölməsi
   - Footer (admin portal linki ilə)

   Məlumatlar /api/speakers, /api/sessions, /api/content, /api/pages
   endpoint-lərindən dinamik olaraq yüklənir.
   ============================================================================= */

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Anchor, Calendar, MapPin, Menu, X, ArrowRight, Clock,
  Compass, Award, Mail, Phone, Linkedin, Twitter, Facebook, Youtube,
  ShieldCheck, FileText, ChevronDown
} from "lucide-react";

/* =============================================================================
   1) BİLİNQVAL TƏRCÜMƏ LÜĞƏTİ (statik UI mətnləri)
   Dinamik məzmun bazadan gəlir, bu lüğət yalnız UI etiketləri üçündür.
============================================================================= */
const T = {
  az: {
    navAbout: "Haqqında", navSpeakers: "Spikerlər", navProgramme: "Proqram",
    navSubmit: "Məqalə göndər", navContact: "Əlaqə",
    submitArticle: "Məqalə göndər",
    learnMore: "Ətraflı",
    heroBadge: "Beynəlxalq Dənizçilik Konfransı",
    heroDate: "15–17 İyun 2026  ·  Bakı, Azərbaycan",
    countdownTitle: "Konfransa qalıb",
    days: "Gün", hours: "Saat", minutes: "Dəqiqə", seconds: "Saniyə",
    plateMaritime: "Dənizçilik təhsili",
    plateYears145: "il · 1881–2026",
    plateYears30: "il · 1996–2026",
    aboutEyebrow: "Konfrans haqqında",
    aboutLeftHead: "İrs — 1881-dən",
    aboutRightHead: "ADDA-nın otuz ili",
    statYears: "il", statAlumni: "məzun", statCountries: "ölkə",
    statFaculties: "fakültə", statShip: "təlim gəmisi",
    speakersEyebrow: "Görkəmli iştirakçılar",
    speakersTitle: "Spikerlər və qonaqlar",
    speakersSub: "On altı ölkədən nazirlər, admirallar, təsnifat cəmiyyətlərinin rəhbərləri və akademik şəxsiyyətlər.",
    viewProfile: "Profilə bax",
    programmeEyebrow: "Üç gün · İki istiqamət",
    programmeTitle: "Konfrans proqramı",
    day1: "1-ci gün", day2: "2-ci gün", day3: "3-cü gün",
    day1Date: "B.e., 15 İyun", day2Date: "Ç.a., 16 İyun", day3Date: "Ç., 17 İyun",
    featured: "Seçilmiş sessiya",
    submitEyebrow: "Elmi məqalə müraciəti",
    submitTitle: "Tədqiqatınızı bizə təqdim edin",
    submitSub: "Konfransa təqdim edilən məqalələr peer-review prosesindən keçir. Annotasiyanızın son təqdim tarixi 15 mart 2026.",
    submitCta: "Məqalə göndərmə formasına keç",
    footerTagline: "Azərbaycan Dövlət Dəniz Akademiyası",
    footerDesc: "1996-cı ildən Xəzər hövzəsinin IMO tərəfindən tanınan əsas ali dənizçilik təhsil müəssisəsi, 145 illik ənənənin varisi.",
    quickLinks: "Sürətli keçidlər",
    resources: "Resurslar",
    contact: "Katibliklə əlaqə",
    accreditation: "Akkreditasiya tərəfdaşları",
    rights: "Bütün hüquqlar qorunur.",
    adminPortal: "Admin paneli",
    privacy: "Məxfilik", terms: "Şərtlər",
    loading: "Yüklənir...",
  },
  en: {
    navAbout: "About", navSpeakers: "Speakers", navProgramme: "Programme",
    navSubmit: "Submit article", navContact: "Contact",
    submitArticle: "Submit article",
    learnMore: "Learn more",
    heroBadge: "International Maritime Conference",
    heroDate: "15–17 June 2026  ·  Baku, Azerbaijan",
    countdownTitle: "Conference begins in",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    plateMaritime: "Maritime education",
    plateYears145: "years · 1881–2026",
    plateYears30: "years · 1996–2026",
    aboutEyebrow: "About the conference",
    aboutLeftHead: "Heritage — since 1881",
    aboutRightHead: "Three decades of ADDA",
    statYears: "years", statAlumni: "alumni", statCountries: "countries",
    statFaculties: "faculties", statShip: "training ship",
    speakersEyebrow: "Distinguished voices",
    speakersTitle: "Speakers & dignitaries",
    speakersSub: "Ministers, admirals, classification society leaders and academic luminaries from sixteen nations.",
    viewProfile: "View profile",
    programmeEyebrow: "Three days · Two tracks",
    programmeTitle: "Conference programme",
    day1: "Day 01", day2: "Day 02", day3: "Day 03",
    day1Date: "Mon 15 June", day2Date: "Tue 16 June", day3Date: "Wed 17 June",
    featured: "Featured session",
    submitEyebrow: "Call for papers",
    submitTitle: "Present your research",
    submitSub: "All submitted papers undergo peer review. Abstract submission deadline: 15 March 2026.",
    submitCta: "Open submission form",
    footerTagline: "Azerbaijan State Marine Academy",
    footerDesc: "The principal IMO-recognised institution of higher maritime education in the Caspian basin since 1996, heir to a 145-year tradition.",
    quickLinks: "Quick links",
    resources: "Resources",
    contact: "Contact secretariat",
    accreditation: "Accreditation partners",
    rights: "All rights reserved.",
    adminPortal: "Admin portal",
    privacy: "Privacy", terms: "Terms",
    loading: "Loading...",
  },
};

/* =============================================================================
   2) FALLBACK MƏZMUN (bazaya bağlantı yox ikən və ya ilk yüklənmədə istifadə olunur)
============================================================================= */
const FALLBACK_CONTENT = {
  hero: {
    title_a: { az: "Azərbaycanda", en: "145 Years of" },
    title_b: { az: "Dənizçilik Təhsilinin", en: "Maritime Education" },
    title_c: { az: "145 İli", en: "in Azerbaijan" },
    subtitle: {
      az: "Azərbaycan Dövlət Dəniz Akademiyasının 30 illiyi münasibətilə admiralları, nazirləri, təsnifat cəmiyyətlərini və yeni nəsil dənizçiləri bir araya gətirən forum.",
      en: "Marking the 30th anniversary of Azerbaijan State Marine Academy — a convening of admirals, ministers, classification societies and the next generation of seafarers.",
    },
  },
  about: {
    title: {
      az: "Üç əsri əhatə edən bir miras",
      en: "A legacy charted across three centuries",
    },
    left_text: {
      az: "Azərbaycanda dənizçilik təhsili 1881-ci ildə Bakı Dəniz Məktəbinin Xəzər sahilində açılışı ilə başlamışdır. 145 il ərzində bu məktəbin varisləri Azərbaycanın bayrağını dünya dənizlərində daşıyan kapitanları, mühəndisləri və gəmi memarlarını yetişdirmişdir.",
      en: "Maritime instruction in Azerbaijan began in 1881 with the founding of the Baku Maritime School on the Caspian shore. For 145 years its descendants have trained the captains, engineers and naval architects who carry Azerbaijan's flag across the world's seas.",
    },
    right_text: {
      az: "1996-cı ildə təsis edilmiş Azərbaycan Dövlət Dəniz Akademiyası Xəzər hövzəsinin IMO tərəfindən tanınan əsas ali dənizçilik təhsil müəssisəsidir. Otuz il ərzində 12 000-dən çox zabit yetişdirib, dünyanın hər yerində ticarət, hərbi və offşor donanmalarında xidmət göstərir.",
      en: "Established in 1996, the Azerbaijan State Marine Academy is the principal IMO-recognised institution of higher maritime education in the Caspian basin. Over thirty years it has graduated more than 12,000 officers serving on commercial, naval and offshore fleets worldwide.",
    },
  },
  footer: {
    tagline: { az: "Azərbaycan Dövlət Dəniz Akademiyası", en: "Azerbaijan State Marine Academy" },
    address: { az: "18 Zərifə Əliyeva, Bakı AZ1010", en: "18 Zarifa Aliyeva St, Baku AZ1010" },
    phone: { az: "+994 12 421 12 81", en: "+994 12 421 12 81" },
    email: { az: "conference@adda.edu.az", en: "conference@adda.edu.az" },
  },
};

const FALLBACK_SPEAKERS = [
  { id: 1, name_az: "Adm. Rəşad Hüseynov", name_en: "Adm. Rashad Huseynov", role_az: "ADDA Rektoru", role_en: "Rector, ADDA", country: "AZ", slug: "rashad-huseynov" },
  { id: 2, name_az: "Dr. Helena Markovic", name_en: "Dr. Helena Markovic", role_az: "IAMU-nun Baş Katibi", role_en: "Secretary General, IAMU", country: "HR", slug: "helena-markovic" },
  { id: 3, name_az: "Kap. Yusuf El-Amin", name_en: "Capt. Yusuf El-Amin", role_az: "Lloyd's Register MENA Direktoru", role_en: "Director, Lloyd's Register MENA", country: "AE", slug: "yusuf-el-amin" },
];

const FALLBACK_SESSIONS = {
  1: [
    { id: 1, day_number: 1, start_time: "08:30", title_az: "Qeydiyyat və qarşılama", title_en: "Registration & welcome coffee", room: "Atrium", duration: 60 },
    { id: 2, day_number: 1, start_time: "10:00", title_az: "Açılış mərasimi — Xəzərdə 145 il", title_en: "Opening ceremony — 145 years on the Caspian", room: "Plenary Hall", is_featured: true, duration: 90 },
    { id: 3, day_number: 1, start_time: "11:30", title_az: "Açar nitq: Dənizçilik təhsilinin gələcəyi", title_en: "Keynote: The future of maritime education", room: "Plenary Hall", duration: 60 },
  ],
  2: [
    { id: 4, day_number: 2, start_time: "09:00", title_az: "Avtonom gəmiçilik və STCW islahatı", title_en: "Autonomous shipping & STCW reform", room: "Hall A", duration: 90 },
    { id: 5, day_number: 2, start_time: "11:00", title_az: "2030-da təsnifat cəmiyyətləri", title_en: "Classification societies in 2030", room: "Hall B", is_featured: true, duration: 90 },
  ],
  3: [
    { id: 6, day_number: 3, start_time: "09:30", title_az: "Yekun plenum və Bakı Bəyannaməsi", title_en: "Closing plenary & Baku Declaration", room: "Plenary Hall", is_featured: true, duration: 120 },
  ],
};

/* =============================================================================
   3) KÖMƏKÇİ HOOK-LAR
============================================================================= */
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

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useLang() {
  const [lang, setLangState] = useState("az");
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("adda_lang");
    if (stored === "az" || stored === "en") setLangState(stored);
  }, []);
  const setLang = (v) => {
    setLangState(v);
    if (typeof window !== "undefined") localStorage.setItem("adda_lang", v);
  };
  return [lang, setLang];
}

/* =============================================================================
   4) ANİMASİYA VARIANT-LARI
============================================================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }
  }),
};

/* =============================================================================
   5) ROOT KOMPONENT
============================================================================= */
export default function HomePage() {
  const [lang, setLang] = useLang();
  const t = T[lang];

  // Bazadan yüklənən məlumatlar
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [speakers, setSpeakers] = useState(FALLBACK_SPEAKERS);
  const [sessions, setSessions] = useState(FALLBACK_SESSIONS);
  const [menuPages, setMenuPages] = useState([]);

  useEffect(() => {
    // Paralel olaraq bütün məlumatları yüklə
    Promise.all([
      fetch("/api/content").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/speakers").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/sessions").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/pages").then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([c, sp, se, pg]) => {
      if (c?.content) setContent(prev => deepMerge(prev, c.content));
      if (sp?.items?.length) setSpeakers(sp.items);
      if (se?.items?.length) {
        const grouped = { 1: [], 2: [], 3: [] };
        se.items.forEach(s => { if (grouped[s.day_number]) grouped[s.day_number].push(s); });
        setSessions(grouped);
      }
      if (pg?.items?.length) {
        setMenuPages(pg.items.filter(p => p.show_in_menu && p.is_published));
      }
    });
  }, []);

  return (
    <div className="font-sans antialiased text-ink bg-white">
      <Header t={t} lang={lang} setLang={setLang} menuPages={menuPages} />
      <Hero t={t} lang={lang} content={content.hero || {}} />
      <Marquee />
      <About t={t} lang={lang} content={content.about || {}} />
      <Speakers t={t} lang={lang} speakers={speakers} />
      <Programme t={t} lang={lang} sessions={sessions} />
      <SubmitCta t={t} />
      <Footer t={t} lang={lang} content={content.footer || {}} menuPages={menuPages} />
    </div>
  );
}

/* Köməkçi: dərin obyekt birləşdirmə (fallback üzərinə bazadan gələn dəyərləri qoyur) */
function deepMerge(target, source) {
  const out = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

/* Köməkçi: bilinqval məzmun obyektindən mətn götür */
function pick(obj, lang, fallback = "") {
  if (!obj) return fallback;
  return obj[lang] || obj.az || obj.en || fallback;
}

/* =============================================================================
   6) HEADER
============================================================================= */
function Header({ t, lang, setLang, menuPages }) {
  const [navOpen, setNavOpen] = useState(false);
  const scrolled = useScrolled(24);

  const links = [
    { href: "#about", label: t.navAbout },
    { href: "#speakers", label: t.navSpeakers },
    { href: "#programme", label: t.navProgramme },
    { href: "/submit-article", label: t.navSubmit, external: true },
    { href: "#contact", label: t.navContact },
    ...menuPages.map(p => ({
      href: `/p/${p.slug}`,
      label: lang === "az" ? p.title_az : p.title_en,
      external: true,
    })),
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,35,102,0.08)]" : "bg-transparent"
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            scrolled ? "bg-navy" : "bg-white/15 backdrop-blur ring-1 ring-white/30"
          }`}>
            <Anchor className={`w-5 h-5 ${scrolled ? "text-gold" : "text-white"}`} strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <div className={`text-[11px] tracking-[0.22em] uppercase font-medium ${scrolled ? "text-navy/70" : "text-white/80"}`}>
              ADDA · 1996
            </div>
            <div className={`font-display text-[17px] font-medium ${scrolled ? "text-navy" : "text-white"}`}>
              {lang === "az" ? "Dənizçilik Konfransı" : "Maritime Conference"}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.slice(0, 5).map(l => (
            l.external ? (
              <Link key={l.href} href={l.href}
                    className={`text-[13.5px] font-medium tracking-wide transition-colors ${
                      scrolled ? "text-ink hover:text-navy" : "text-white/90 hover:text-white"
                    }`}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href}
                 className={`text-[13.5px] font-medium tracking-wide transition-colors ${
                   scrolled ? "text-ink hover:text-navy" : "text-white/90 hover:text-white"
                 }`}>
                {l.label}
              </a>
            )
          ))}
          {/* Dinamik səhifələr dropdown formasında */}
          {menuPages.length > 0 && (
            <MenuPagesDropdown pages={menuPages} lang={lang} scrolled={scrolled} />
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <LangToggle lang={lang} setLang={setLang} scrolled={scrolled} />
          <Link href="/submit-article"
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide transition-all ${
                  scrolled
                    ? "bg-navy text-white hover:bg-navy-deep"
                    : "bg-white text-navy hover:bg-gold hover:text-white"
                }`}>
            {t.submitArticle}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => setNavOpen(!navOpen)}
                  className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center ${
                    scrolled ? "text-navy" : "text-white"
                  }`}
                  aria-label="Menu">
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {navOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="lg:hidden bg-white border-t border-navy/10">
            <div className="px-6 py-6 space-y-4">
              {links.map(l => (
                l.external ? (
                  <Link key={l.href} href={l.href} onClick={() => setNavOpen(false)}
                        className="block text-[15px] font-medium text-navy">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}
                     className="block text-[15px] font-medium text-navy">
                    {l.label}
                  </a>
                )
              ))}
              <Link href="/submit-article" onClick={() => setNavOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-navy text-white text-[14px]">
                {t.submitArticle} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuPagesDropdown({ pages, lang, scrolled }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button onMouseEnter={() => setOpen(true)} onClick={() => setOpen(!open)}
              className={`text-[13.5px] font-medium tracking-wide transition-colors flex items-center gap-1 ${
                scrolled ? "text-ink hover:text-navy" : "text-white/90 hover:text-white"
              }`}>
        {lang === "az" ? "Daha çox" : "More"}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full right-0 mt-2 min-w-[220px] bg-white shadow-xl rounded-xl py-2 ring-1 ring-navy/5">
            {pages.map(p => (
              <Link key={p.slug} href={`/p/${p.slug}`}
                    className="block px-5 py-2.5 text-[13.5px] text-ink hover:bg-cream hover:text-navy">
                {lang === "az" ? p.title_az : p.title_en}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LangToggle({ lang, setLang, scrolled }) {
  return (
    <div className={`flex items-center rounded-full p-1 ring-1 transition-colors ${
      scrolled ? "ring-navy/15 bg-navy/5" : "ring-white/30 bg-white/10 backdrop-blur"
    }`}>
      {["az", "en"].map(code => {
        const active = lang === code;
        return (
          <button key={code} onClick={() => setLang(code)}
                  className={`px-3 py-1 text-[11.5px] font-semibold tracking-[0.18em] uppercase rounded-full transition-all ${
                    active
                      ? (scrolled ? "bg-navy text-white" : "bg-white text-navy")
                      : (scrolled ? "text-navy/60 hover:text-navy" : "text-white/70 hover:text-white")
                  }`}>
            {code}
          </button>
        );
      })}
    </div>
  );
}

/* =============================================================================
   7) HERO
============================================================================= */
function Hero({ t, lang, content }) {
  const target = useMemo(() => new Date("2026-06-15T09:00:00+04:00"), []);
  const { d, h, m, s } = useCountdown(target);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1494137148171-4f78b30e9be8?w=2400&q=80"
             alt="Caspian Sea"
             className="w-full h-full object-cover"
             onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy/75 to-navy-dark" />
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse at top right, rgba(201,165,90,0.15), transparent 60%)" }} />
      </div>

      {/* Compass decoration */}
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

      {/* Top eyebrow */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pt-32">
        <motion.div variants={fadeUp} initial="hidden" animate="show"
                    className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white/80">
          <span className="w-8 h-px bg-gold" />
          {t.heroBadge}
        </motion.div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-28 pt-10 grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                     className="font-display font-light leading-[0.92] text-balance"
                     style={{ fontSize: "clamp(48px, 7.5vw, 108px)" }}>
            {pick(content.title_a, lang, lang === "az" ? "Azərbaycanda" : "145 Years of")}<br />
            <span className="italic font-normal">
              {pick(content.title_b, lang, lang === "az" ? "Dənizçilik Təhsilinin" : "Maritime Education")}
            </span><br />
            {pick(content.title_c, lang, lang === "az" ? "145 İli" : "in Azerbaijan")}
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                    className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80">
            {pick(content.subtitle, lang)}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                      className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-7 py-4 rounded-full text-[13.5px] font-semibold tracking-wide transition-all">
              {t.submitArticle}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#about"
               className="inline-flex items-center gap-3 border border-white/30 hover:border-white px-7 py-4 rounded-full text-[13.5px] font-medium text-white/90 hover:text-white transition-all">
              {t.learnMore}
            </a>
          </motion.div>
        </div>

        {/* 145/30 plate */}
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

      {/* Bottom strip */}
      <div className="relative z-10 border-t border-white/10 bg-[#000c24]/40 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/70">
            <Calendar className="w-4 h-4 text-gold" />
            {t.heroDate}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 mr-2">{t.countdownTitle}</span>
            <CountdownCell value={d} label={t.days} />
            <CountdownCell value={h} label={t.hours} />
            <CountdownCell value={m} label={t.minutes} />
            <CountdownCell value={s} label={t.seconds} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownCell({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[58px]">
      <div className="font-display text-[28px] leading-none text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] tracking-[0.25em] uppercase text-white/55 mt-1">{label}</div>
    </div>
  );
}

/* =============================================================================
   8) MARQUEE
============================================================================= */
function Marquee() {
  return (
    <div className="bg-navy text-white py-8 overflow-hidden">
      <div className="flex items-center gap-16 whitespace-nowrap"
           style={{ animation: "adda-marquee 45s linear infinite" }}>
        {Array.from({ length: 4 }).map((_, k) => (
          <div key={k} className="flex items-center gap-16 shrink-0">
            <span className="font-display text-[38px] font-light italic">145 + 30</span>
            <span className="text-gold">◆</span>
            <span className="text-[12px] tracking-[0.3em] uppercase">Caspian · International · Diplomatic</span>
            <span className="text-gold">◆</span>
            <span className="font-display text-[38px] font-light">Anchored in heritage</span>
            <span className="text-gold">◆</span>
            <span className="text-[12px] tracking-[0.3em] uppercase">Baku · 15–17 June 2026</span>
            <span className="text-gold">◆</span>
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

/* =============================================================================
   9) ABOUT
============================================================================= */
function About({ t, lang, content }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="relative py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" />
            {t.aboutEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {pick(content.title, lang, lang === "az" ? "Üç əsri əhatə edən bir miras" : "A legacy charted across three centuries")}
          </h2>
        </motion.div>

        <div className="mt-20 grid lg:grid-cols-2 gap-px bg-navy/10">
          <motion.div initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }}
                      className="bg-white p-10 lg:p-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-navy" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">1881</span>
            </div>
            <h3 className="font-display text-[28px] text-navy mb-4">{t.aboutLeftHead}</h3>
            <p className="text-[15px] leading-[1.75] text-ink/75">{pick(content.left_text, lang)}</p>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-navy/10">
              <Stat number="145" label={t.statYears} />
              <Stat number="12k+" label={t.statAlumni} />
              <Stat number="42" label={t.statCountries} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      className="bg-navy text-white p-10 lg:p-14 relative overflow-hidden">
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
              <p className="text-[15px] leading-[1.75] text-white/80">{pick(content.right_text, lang)}</p>
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

/* =============================================================================
   10) SPEAKERS
============================================================================= */
function Speakers({ t, lang, speakers }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // İlk hərflər (foto yoxdursa)
  const initials = (name) => name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("");
  const accents = ["from-gold to-gold-dark", "from-navy-deep to-navy-dark"];

  return (
    <section id="speakers" ref={ref} className="py-32 bg-cream relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }}
                      className="max-w-2xl">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
              <span className="w-8 h-px bg-gold" />
              {t.speakersEyebrow}
            </div>
            <h2 className="font-display font-light leading-[1] text-navy text-balance"
                style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
              {t.speakersTitle}
            </h2>
            <p className="mt-6 text-[15px] text-ink/70 max-w-lg">{t.speakersSub}</p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10">
          {speakers.map((sp, i) => (
            <motion.div key={sp.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.06 }}>
              <Link href={`/speakers/${sp.slug}`}
                    className="group bg-white p-8 hover:bg-navy transition-all duration-500 relative block h-full">
                {sp.photo_url ? (
                  <img src={sp.photo_url} alt={lang === "az" ? sp.name_az : sp.name_en}
                       className="w-20 h-20 rounded-full object-cover mb-6" />
                ) : (
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${accents[i % 2]} flex items-center justify-center text-white font-display text-[24px] mb-6`}>
                    {initials(sp.name_en || sp.name_az)}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-ink/50 group-hover:text-gold mb-3 transition-colors">
                  {sp.country} · {lang === "az" ? "Spiker" : "Speaker"}
                </div>
                <h3 className="font-display text-[22px] text-navy group-hover:text-white transition-colors leading-tight">
                  {lang === "az" ? sp.name_az : sp.name_en}
                </h3>
                <p className="mt-2 text-[13.5px] text-ink/70 group-hover:text-white/75 transition-colors">
                  {lang === "az" ? sp.role_az : sp.role_en}
                </p>
                <div className="mt-8 pt-6 border-t border-navy/10 group-hover:border-white/15 transition-colors flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink/40 group-hover:text-white/50 transition-colors">
                    {t.viewProfile}
                  </span>
                  <ArrowRight className="w-4 h-4 text-navy group-hover:text-gold transition-all group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   11) PROGRAMME
============================================================================= */
function Programme({ t, lang, sessions }) {
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
        <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" />
            {t.programmeEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {t.programmeTitle}
          </h2>
        </motion.div>

        {/* Day tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[1, 2, 3].map(d => {
            const active = day === d;
            return (
              <button key={d} onClick={() => setDay(d)}
                      className={`flex items-center gap-4 pl-5 pr-7 py-4 rounded-full transition-all border ${
                        active
                          ? "bg-navy text-white border-navy"
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
            {(sessions[day] || []).map((s, i) => (
              <motion.div key={s.id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
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
            {(sessions[day] || []).length === 0 && (
              <div className="py-12 text-center text-ink/45 text-sm">
                {lang === "az" ? "Bu gün üçün sessiya yoxdur." : "No sessions for this day."}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =============================================================================
   12) SUBMIT ARTICLE CTA
============================================================================= */
function SubmitCta({ t }) {
  return (
    <section className="py-32 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white relative overflow-hidden">
      <svg className="absolute -left-40 -bottom-40 w-[600px] h-[600px] opacity-[0.05]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="42" stroke="white" strokeWidth="0.4" fill="none" />
      </svg>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
              <span className="w-8 h-px bg-gold" />
              {t.submitEyebrow}
            </div>
            <h2 className="font-display font-light leading-[1] text-balance mb-6"
                style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>
              {t.submitTitle}
            </h2>
            <p className="text-[15px] text-white/70 leading-relaxed max-w-lg">
              {t.submitSub}
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-8 py-5 rounded-full text-[14px] font-semibold tracking-wide transition-all">
              <FileText className="w-5 h-5" />
              {t.submitCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =============================================================================
   13) FOOTER
============================================================================= */
function Footer({ t, lang, content, menuPages }) {
  return (
    <footer id="contact" className="bg-navy-dark text-white pt-24 pb-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center ring-1 ring-gold/40">
                <Anchor className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold">ADDA</div>
                <div className="font-display text-[20px]">
                  {pick(content.tagline, lang, t.footerTagline)}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-white/60 max-w-md">
              {t.footerDesc}
            </p>
            <div className="mt-8 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Ic, i) => (
                <a key={i} href="#"
                   className="w-10 h-10 rounded-full border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
                   aria-label="Social link">
                  <Ic className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.quickLinks}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li><a href="#about" className="hover:text-white">{t.navAbout}</a></li>
              <li><a href="#speakers" className="hover:text-white">{t.navSpeakers}</a></li>
              <li><a href="#programme" className="hover:text-white">{t.navProgramme}</a></li>
              <li><Link href="/submit-article" className="hover:text-white">{t.navSubmit}</Link></li>
            </ul>
          </div>

          {/* Resources (dinamik səhifələr) */}
          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.resources}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              {menuPages.length > 0 ? (
                menuPages.map(p => (
                  <li key={p.slug}>
                    <Link href={`/p/${p.slug}`} className="hover:text-white">
                      {lang === "az" ? p.title_az : p.title_en}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><span className="text-white/40">{lang === "az" ? "Mətbuat paketi" : "Press kit"}</span></li>
                  <li><span className="text-white/40">{lang === "az" ? "Viza dəstəyi" : "Visa support"}</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.contact}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <a href={`mailto:${pick(content.email, lang, "conference@adda.edu.az")}`} className="hover:text-white">
                  {pick(content.email, lang, "conference@adda.edu.az")}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                {pick(content.phone, lang, "+994 12 421 12 81")}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                {pick(content.address, lang, "18 Zərifə Əliyeva, Bakı AZ1010")}
              </li>
            </ul>
          </div>
        </div>

        {/* Accreditation */}
        <div className="py-10 border-b border-white/10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6">{t.accreditation}</div>
          <div className="flex flex-wrap items-center gap-8 lg:gap-14">
            {["IMO", "IAMU", "Lloyd's Register", "ClassNK", "BIMCO", "Det Norske Veritas"].map(n => (
              <div key={n} className="text-white/50 hover:text-white/90 transition-colors font-display text-[18px] tracking-tight">
                {n}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-white/50">
          <div>© 2026 ADDA · {t.rights}</div>
          <div className="flex items-center gap-6">
            <Link href="/admin/login"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.adminPortal}
            </Link>
            <span>{t.privacy}</span>
            <span>{t.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
