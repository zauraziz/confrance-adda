"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { useLang } from "./LangProvider";

export default function PublicHeader({ menuPages = [] }) {
  const { lang, setLang, t } = useLang();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#about", label: t.navAbout },
    { href: "/#speakers", label: t.navSpeakers },
    { href: "/#programme", label: t.navProgramme },
    { href: "/submit-article", label: t.navSubmit },
    { href: "/#contact", label: t.navContact },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,35,102,0.08)]" : "bg-transparent"
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            scrolled ? "bg-navy" : "bg-white/15 backdrop-blur ring-1 ring-white/30"
          }`}>
            <Anchor className={`w-5 h-5 ${scrolled ? "text-gold" : "text-white"}`} strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <div className={`text-[11px] tracking-[0.22em] uppercase font-medium ${scrolled ? "text-navy/70" : "text-white/80"}`}>ADDA · 1996</div>
            <div className={`font-display text-[17px] font-medium ${scrolled ? "text-navy" : "text-white"}`}>
              {lang === "az" ? "Dənizçilik Konfransı" : "Maritime Conference"}
            </div>
          </div>
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
          <Link href="/submit-article"
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
