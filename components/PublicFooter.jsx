"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube, ShieldCheck } from "lucide-react";
import { useLang } from "./LangProvider";
import { pick } from "@/lib/i18n";

export default function PublicFooter({ content = {}, menuPages = [] }) {
  const { lang, t } = useLang();
  const isAz = lang === "az";

  return (
    <footer id="contact" className="bg-navy-dark text-white pt-24 pb-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="28" fill="none" stroke="#c9a55a" strokeWidth="1.5" opacity="0.5"/>
                <circle cx="30" cy="30" r="25" fill="none" stroke="#c9a55a" strokeWidth="0.5" opacity="0.4"/>
                <g transform="translate(30,30)" stroke="#c9a55a" strokeWidth="1" opacity="0.95">
                  <circle cx="0" cy="0" r="11" fill="none"/>
                  <circle cx="0" cy="0" r="3" fill="#c9a55a"/>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                    <line key={a} x1="0" y1="0"
                          x2={Math.cos(a * Math.PI / 180) * 14}
                          y2={Math.sin(a * Math.PI / 180) * 14}/>
                  ))}
                </g>
                <text x="30" y="55" textAnchor="middle" fontFamily="serif" fontSize="6"
                      fontWeight="600" fill="#c9a55a" letterSpacing="0.1em">1996</text>
              </svg>
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-gold">ADDA</div>
                <div className="font-display text-[18px] leading-tight">
                  {isAz ? "Azərbaycan Dövlət Dəniz Akademiyası" : "Azerbaijan State Marine Academy"}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-white/60 max-w-md">
              {isAz
                ? "1996-cı ildən IMO tərəfindən tanınan əsas ali dənizçilik təhsil müəssisəsi. Beynəlxalq Elmi-Praktiki Konfrans çərçivəsində elmi əməkdaşlıq və təcrübə mübadiləsi platforması."
                : "Since 1996, the principal IMO-recognised institution of higher maritime education. International Scientific-Practical Conference platform for academic cooperation and exchange."
              }
            </p>

            {/* GOVERNMENT HIERARCHY - sadə loqolar (başlıq yox) */}
            <div className="mt-8 flex items-center gap-5 flex-wrap">
              {[
                { short: "RİNN", title_az: "Rəqəmsal İnkişaf və Nəqliyyat Nazirliyi", title_en: "Ministry of Digital Development and Transport", href: "https://mincom.gov.az" },
                { short: "AZCON", title_az: "AZCON Holdinq", title_en: "AZCON Holding", href: "https://azcon.az" },
                { short: "ASCO", title_az: "Azərbaycan Xəzər Dəniz Gəmiçiliyi", title_en: "Azerbaijan Caspian Shipping", href: "https://www.asco.az" },
                { short: "DDLA", title_az: "Dövlət Dəniz və Liman Agentliyi", title_en: "State Maritime and Port Agency", href: "https://maritime.gov.az" },
              ].map(org => (
                <a key={org.short} href={org.href} target="_blank" rel="noopener noreferrer"
                   title={isAz ? org.title_az : org.title_en}
                   className="group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/25 group-hover:border-gold/60 group-hover:from-gold/30 transition-all">
                    <span className="font-display text-[10px] font-semibold text-gold tracking-tight">
                      {org.short}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* SOCIAL */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { Ic: Linkedin, href: "https://linkedin.com" },
                { Ic: Facebook, href: "https://facebook.com" },
                { Ic: Youtube, href: "https://youtube.com" },
              ].map(({ Ic, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label="Social"
                   className="w-9 h-9 rounded-full border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Ic className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.quickLinks}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li><Link href="/#about" className="hover:text-white">{t.navAbout}</Link></li>
              <li><Link href="/#sections" className="hover:text-white">{isAz ? "Bölmələr" : "Sections"}</Link></li>
              <li><Link href="/#programme" className="hover:text-white">{t.navProgramme}</Link></li>
              <li><Link href="/register" className="hover:text-white">{t.navSubmit}</Link></li>
              <li><Link href="/submit-article" className="hover:text-white">{isAz ? "Məqalə göndər" : "Submit article"}</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="lg:col-span-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.resources}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li><Link href="/p/privacy" className="hover:text-white">{t.privacy}</Link></li>
              <li><Link href="/p/terms" className="hover:text-white">{t.terms}</Link></li>
              {menuPages.filter(p => p.slug !== 'etrafli').map(p => (
                <li key={p.slug}>
                  <Link href={`/p/${p.slug}`} className="hover:text-white">
                    {lang === "az" ? p.title_az : p.title_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-5">{t.contact}</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <a href="mailto:samira.gozalova@adda.edu.az" className="hover:text-white break-all">
                  samira.gozalova@adda.edu.az
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>+994 50 516 34 00</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>Bakı, Azərbaycan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-white/50">
          <div>© 2026 ADDA · {t.rights}</div>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.adminPortal}
            </Link>
            <Link href="/p/privacy" className="hover:text-white">{t.privacy}</Link>
            <Link href="/p/terms" className="hover:text-white">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
