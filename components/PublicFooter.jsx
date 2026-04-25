"use client";
import Link from "next/link";
import { Anchor, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube, ShieldCheck } from "lucide-react";
import { useLang } from "./LangProvider";
import { pick } from "@/lib/i18n";

export default function PublicFooter({ content = {}, menuPages = [] }) {
  const { lang, t } = useLang();
  return (
    <footer id="contact" className="bg-navy-dark text-white pt-24 pb-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center ring-1 ring-gold/40">
                <Anchor className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold">ADDA</div>
                <div className="font-display text-[20px]">{pick(content.tagline, lang, t.footerTagline)}</div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-white/60 max-w-md">{t.footerDesc}</p>
            <div className="mt-8 flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Ic, i) => (
                <a key={i} href="#" aria-label="Social"
                   className="w-10 h-10 rounded-full border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Ic className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.quickLinks}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li><Link href="/#about" className="hover:text-white">{t.navAbout}</Link></li>
              <li><Link href="/#speakers" className="hover:text-white">{t.navSpeakers}</Link></li>
              <li><Link href="/#programme" className="hover:text-white">{t.navProgramme}</Link></li>
              <li><Link href="/submit-article" className="hover:text-white">{t.navSubmit}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.resources}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              {menuPages.length > 0 ? menuPages.map(p => (
                <li key={p.slug}>
                  <Link href={`/p/${p.slug}`} className="hover:text-white">
                    {lang === "az" ? p.title_az : p.title_en}
                  </Link>
                </li>
              )) : (
                <li className="text-white/35 italic">{lang === "az" ? "Tezliklə..." : "Coming soon..."}</li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.contact}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <a href={`mailto:${pick(content.email, lang, "conference@adda.edu.az")}`} className="hover:text-white break-all">
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

        <div className="py-10 border-b border-white/10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6">{t.accreditation}</div>
          <div className="flex flex-wrap items-center gap-8 lg:gap-14">
            {["IMO", "IAMU", "Lloyd's Register", "ClassNK", "BIMCO", "Det Norske Veritas"].map(n => (
              <div key={n} className="text-white/50 hover:text-white/90 transition-colors font-display text-[18px]">{n}</div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-white/50">
          <div>© 2026 ADDA · {t.rights}</div>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.adminPortal}
            </Link>
            <span>{t.privacy}</span>
            <span>{t.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
