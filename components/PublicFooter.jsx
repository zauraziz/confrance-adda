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
            <div className="mt-8 flex items-center gap-3">
              {[
                { Ic: Linkedin, href: "https://linkedin.com" },
                { Ic: Facebook, href: "https://facebook.com" },
                { Ic: Youtube, href: "https://youtube.com" },
              ].map(({ Ic, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label="Social"
                   className="w-10 h-10 rounded-full border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Ic className="w-4 h-4" />
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
              {menuPages.length > 0 ? menuPages.map(p => (
                <li key={p.slug}>
                  <Link href={`/p/${p.slug}`} className="hover:text-white">
                    {lang === "az" ? p.title_az : p.title_en}
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link href="/p/etrafli" className="hover:text-white">{isAz ? "Ətraflı" : "Details"}</Link></li>
                  <li><Link href="/p/privacy" className="hover:text-white">{t.privacy}</Link></li>
                  <li><Link href="/p/terms" className="hover:text-white">{t.terms}</Link></li>
                </>
              )}
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

        {/* GOVERNMENT HIERARCHY - ASCO, AZCON, Nazirlik, Liman Agentliyi */}
        <div className="py-10 border-b border-white/10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8 text-center">
            {isAz ? "Tabe olduğu qurumlar" : "Affiliated organizations"}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                short: "RİNN",
                full_az: "Rəqəmsal İnkişaf və\nNəqliyyat Nazirliyi",
                full_en: "Ministry of Digital\nDevelopment and Transport",
                href: "https://mincom.gov.az",
              },
              {
                short: "AZCON",
                full_az: "AZCON Holdinq",
                full_en: "AZCON Holding",
                href: "https://azcon.az",
              },
              {
                short: "ASCO",
                full_az: "Azərbaycan Xəzər Dəniz\nGəmiçiliyi (ASCO)",
                full_en: "Azerbaijan Caspian\nShipping Company",
                href: "https://www.asco.az",
              },
              {
                short: "DDLA",
                full_az: "Dövlət Dəniz və\nLiman Agentliyi",
                full_en: "State Maritime and\nPort Agency",
                href: "https://maritime.gov.az",
              },
            ].map((org) => (
              <a key={org.short} href={org.href} target="_blank" rel="noopener noreferrer"
                 className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-gold/40 hover:bg-white/[0.03] transition-all">
                {/* Stylized monogram */}
                <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/30 group-hover:from-gold/30 transition-colors">
                  <span className="font-display text-[15px] font-semibold text-gold tracking-tight">
                    {org.short}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-white/90 leading-tight whitespace-pre-line">
                    {isAz ? org.full_az : org.full_en}
                  </div>
                </div>
              </a>
            ))}
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
