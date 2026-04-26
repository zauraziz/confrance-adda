"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Award, MapPin, Calendar, Users, FileText } from "lucide-react";
import { useLang } from "./LangProvider";
import { pick } from "@/lib/i18n";

export default function HomeAbout({ content = {} }) {
  const { lang, t } = useLang();
  const isAz = lang === "az";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="about" ref={ref} className="relative py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" /> {t.aboutEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {pick(content.title, lang, t.aboutTitle)}
          </h2>
          <p className="mt-8 text-[16px] leading-relaxed text-ink/75 max-w-2xl">
            {isAz
              ? "Azərbaycanda dənizçilik təhsilinin 145 illiyi, Azərbaycan Dövlət Dəniz Akademiyasının yaranmasının 30 illik yubiley tədbirləri çərçivəsində \"İnnovativ Dənizçilik və Dayanıqlı İnkişaf\" mövzusunda Beynəlxalq Elmi-Praktiki Konfrans təşkil olunur."
              : "The International Scientific-Practical Conference on \"Innovative Maritime and Sustainable Development\" marks 145 years of maritime education in Azerbaijan and the 30th anniversary of the Azerbaijan State Marine Academy."
            }
          </p>
        </motion.div>

        {/* HERITAGE & ACADEMY */}
        <div className="mt-16 grid lg:grid-cols-2 gap-px bg-navy/10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }} className="bg-white p-10 lg:p-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                <Compass className="w-5 h-5 text-navy" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">1881</span>
            </div>
            <h3 className="font-display text-[28px] text-navy mb-4">{t.aboutLeftHead}</h3>
            <p className="text-[15px] leading-[1.75] text-ink/75">{pick(content.left_text, lang, t.aboutLeftText)}</p>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-navy/10">
              <Stat number="145" label={t.statYears} />
              <Stat number="12k+" label={t.statAlumni} />
              <Stat number="42" label={t.statCountries} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.1 }} className="bg-navy text-white p-10 lg:p-14 relative overflow-hidden">
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
              <p className="text-[15px] leading-[1.75] text-white/80">{pick(content.right_text, lang, t.aboutRightText)}</p>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/15">
                <Stat number="30" label={t.statYears} gold />
                <Stat number="6" label={t.statFaculties} gold />
                <Stat number="1" label={t.statShip} gold />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CONFERENCE DETAILS - Ətraflı kontentindən */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-16 bg-cream rounded-3xl p-10 lg:p-14">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
                {isAz ? "Konfrans haqqında" : "About the conference"}
              </div>
              <h3 className="font-display text-[32px] text-navy leading-tight mb-6">
                {isAz ? "Tədbirin formatı və məqsədi" : "Format and objectives"}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-ink/75 mb-6">
                {isAz
                  ? "Konfransın əsas məqsədi dənizçilik sahəsində beynəlxalq əməkdaşlığı gücləndirmək, elmi-praktiki tədqiqatların nəticələrini müzakirə etmək, innovativ texnologiyaların və dayanıqlı inkişaf modellərinin tətbiqi istiqamətində təcrübə mübadiləsi aparmaqdır."
                  : "The conference aims to strengthen international cooperation in maritime affairs, discuss research findings, and exchange experience in implementing innovative technologies and sustainable development models."
                }
              </p>
              <p className="text-[14.5px] leading-relaxed text-ink/75">
                {isAz
                  ? "Konfransda dinlənilən məruzələr \"Konfransın məruzələr toplusu\"nda dərc ediləcək. Təşkilat komitəsinin qərarı ilə seçilmiş məruzələr beynəlxalq xülasələndirmə bazalarında indeksləşdiriləcəkdir."
                  : "Conference proceedings will be published in the official volume. Selected papers will be indexed in international abstracting databases by decision of the organizing committee."
                }
              </p>
            </div>

            <div className="space-y-5">
              <DetailRow
                icon={Calendar}
                label={isAz ? "Tarix" : "Date"}
                value={isAz ? "29-30 Oktyabr 2026" : "29-30 October 2026"}
                sub={isAz ? "Yubiley günü: 28 Oktyabr 2026" : "Jubilee day: 28 October 2026"}
              />
              <DetailRow
                icon={MapPin}
                label={isAz ? "Məkan" : "Venue"}
                value="Baku Marriott Hotel Boulevard"
                sub={isAz ? "Bakı, Azərbaycan" : "Baku, Azerbaijan"}
              />
              <DetailRow
                icon={Users}
                label={isAz ? "Format" : "Format"}
                value={isAz ? "Hibrid (əyani və onlayn)" : "Hybrid (in-person and online)"}
                sub={isAz ? "16+ ölkədən iştirakçılar" : "Participants from 16+ countries"}
              />
              <DetailRow
                icon={FileText}
                label={isAz ? "Nəşrlər" : "Publications"}
                value={isAz ? "Konfrans toplusu" : "Conference proceedings"}
                sub={isAz ? "Beynəlxalq xülasə bazalarında" : "Indexed in abstracting databases"}
              />
            </div>
          </div>

          {/* CONTACT BAR */}
          <div className="mt-10 pt-8 border-t border-navy/10 grid sm:grid-cols-3 gap-6">
            <ContactBlock
              name="Samirə Gözəlova"
              email="samira.gozalova@adda.edu.az"
            />
            <ContactBlock
              name="Əli Əliyev"
              phone="+994 50 516 34 00"
            />
            <ContactBlock
              name="Qulu Quliyev"
              phone="+994 50 516 34 00"
            />
          </div>
        </motion.div>
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

function DetailRow({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-white border border-navy/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 mb-1">{label}</div>
        <div className="font-display text-[17px] text-navy leading-tight">{value}</div>
        {sub && <div className="text-[12.5px] text-ink/60 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function ContactBlock({ name, email, phone }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 mb-1">Əlaqələndirici</div>
      <div className="font-display text-[15px] text-navy mb-1">{name}</div>
      {email && <a href={`mailto:${email}`} className="text-[12.5px] text-ink/65 hover:text-gold break-all">{email}</a>}
      {phone && <div className="text-[12.5px] text-ink/65">{phone}</div>}
    </div>
  );
}
