"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { useLang } from "./LangProvider";

export default function PublicHeader({ menuPages = [], menuItems = null, logoUrl = null }) {
  const { lang, setLang, t } = useLang();
  const isAz = lang === "az";
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Default links - əgər admin-dən menyu gəlmirsə
  const defaultLinks = [
    { href: "/#about", label: t.navAbout },
    { href: "/#sections", label: isAz ? "Bölmələr" : "Sections" },
    { href: "/#speakers", label: t.navSpeakers },
    { href: "/#programme", label: t.navProgramme },
    { href: "/register", label: t.navSubmit },
    { href: "/#contact", label: t.navContact },
  ];

  const links = menuItems && menuItems.length > 0
    ? menuItems.filter(m => m.is_active && (m.position === "header" || m.position === "both"))
        .map(m => ({ href: m.href, label: lang === "az" ? m.label_az : m.label_en }))
    : defaultLinks;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,35,102,0.08)]" : "bg-transparent"
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo scrolled={scrolled} customUrl={logoUrl} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <Link key={l.href} href={l.href}
                  className={`text-[13.5px] font-medium tracking-wide transition-colors ${
                    scrolled ? "text-ink hover:text-navy" : "text-white/90 hover:text-white"
                  }`}>
              {l.label}
            </Link>
          ))}
          {menuPages.length > 0 && (
            <MenuPagesDropdown pages={menuPages} lang={lang} scrolled={scrolled} label={t.navMore} />
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LangToggle lang={lang} setLang={setLang} scrolled={scrolled} />
          <Link href="/register"
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide transition-all ${
                  scrolled ? "bg-navy text-white hover:bg-navy-deep" : "bg-white text-navy hover:bg-gold hover:text-white"
                }`}>
            {t.submitArticle} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => setNavOpen(!navOpen)} aria-label="Menu"
                  className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center ${scrolled ? "text-navy" : "text-white"}`}>
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {navOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="lg:hidden bg-white border-t border-navy/10">
            <div className="px-6 py-6 space-y-4">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setNavOpen(false)}
                      className="block text-[15px] font-medium text-navy">{l.label}</Link>
              ))}
              {menuPages.map(p => (
                <Link key={p.slug} href={`/p/${p.slug}`} onClick={() => setNavOpen(false)}
                      className="block text-[15px] font-medium text-navy">
                  {lang === "az" ? p.title_az : p.title_en}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Logo({ scrolled, customUrl }) {
  // Əgər admin custom logo yükləyibsə
  if (customUrl && customUrl.length > 5 && !customUrl.endsWith("default-logo.svg")) {
    return <img src={customUrl} alt="ADDA Conference" className="h-12 w-auto" />;
  }

  // ADDA Maritime Academy əsaslı default logo
  const primary = scrolled ? "#002366" : "#ffffff";
  const accent = "#c9a55a";

  return (
    <div className="flex items-center gap-3">
      {/* SVG monogram */}
      <svg width="44" height="44" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="30" cy="30" r="28" fill="none" stroke={primary} strokeWidth="1.5" opacity={scrolled ? 0.4 : 0.5}/>
        <circle cx="30" cy="30" r="25" fill="none" stroke={primary} strokeWidth="0.5" opacity={scrolled ? 0.3 : 0.4}/>
        {/* Ship wheel - 8 spokes */}
        <g transform="translate(30,30)" stroke={primary} strokeWidth="1" opacity={scrolled ? 0.85 : 0.95}>
          <circle cx="0" cy="0" r="11" fill="none"/>
          <circle cx="0" cy="0" r="3" fill={accent}/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <line key={a} x1="0" y1="0"
                  x2={Math.cos(a * Math.PI / 180) * 14}
                  y2={Math.sin(a * Math.PI / 180) * 14}/>
          ))}
        </g>
        {/* Year text */}
        <text x="30" y="55" textAnchor="middle" fontFamily="serif" fontSize="6"
              fontWeight="600" fill={primary} letterSpacing="0.1em" opacity={scrolled ? 0.6 : 0.7}>1996</text>
      </svg>

      <div className="leading-tight">
        <div className={`text-[10px] tracking-[0.22em] uppercase font-medium ${scrolled ? "text-navy/70" : "text-white/80"}`}>
          ADDA · 1996
        </div>
        <div className={`font-display text-[16px] font-medium ${scrolled ? "text-navy" : "text-white"}`}>
          Maritime Conference
        </div>
      </div>
    </div>
  );
}

function MenuPagesDropdown({ pages, lang, scrolled, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button onMouseEnter={() => setOpen(true)} onClick={() => setOpen(!open)}
              className={`text-[13.5px] font-medium tracking-wide flex items-center gap-1 ${
                scrolled ? "text-ink hover:text-navy" : "text-white/90 hover:text-white"
              }`}>
        {label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full right-0 mt-2 min-w-[220px] bg-white shadow-xl rounded-xl py-2 ring-1 ring-navy/5 z-50">
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
                    active ? (scrolled ? "bg-navy text-white" : "bg-white text-navy")
                           : (scrolled ? "text-navy/60 hover:text-navy" : "text-white/70 hover:text-white")
                  }`}>{code}</button>
        );
      })}
    </div>
  );
}
