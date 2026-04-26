"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Clock, MapPin, Coffee, Users, Award } from "lucide-react";
import { useLang } from "./LangProvider";

export default function HomeProgramme({ schedule = { 1: [], 2: [] } }) {
  const { lang, t } = useLang();
  const isAz = lang === "az";
  const [day, setDay] = useState(1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // Default programme data (proqram faylına uyğun)
  const defaultDay1 = [
    { id: "d1-1", start_time: "09:30", duration: 30, title_az: "Qeydiyyat", title_en: "Registration", room: "Atrium" },
    { id: "d1-2", start_time: "10:00", duration: 90, title_az: "Açılış mərasimi və plenar sessiya", title_en: "Opening Ceremony and Plenary Session", room: "Plenary Hall", is_featured: true },
    { id: "d1-3", start_time: "11:30", duration: 30, title_az: "Qəhvə fasiləsi", title_en: "Coffee Break", icon: "coffee" },
    { id: "d1-4", start_time: "12:00", duration: 60, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
    { id: "d1-5", start_time: "13:00", duration: 60, title_az: "Nahar", title_en: "Lunch", icon: "food" },
    { id: "d1-6", start_time: "14:00", duration: 90, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
    { id: "d1-7", start_time: "15:30", duration: 15, title_az: "Qəhvə fasiləsi", title_en: "Coffee Break", icon: "coffee" },
    { id: "d1-8", start_time: "15:45", duration: 75, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
  ];

  const defaultDay2 = [
    { id: "d2-1", start_time: "10:00", duration: 90, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
    { id: "d2-2", start_time: "11:30", duration: 30, title_az: "Qəhvə fasiləsi", title_en: "Coffee Break", icon: "coffee" },
    { id: "d2-3", start_time: "12:00", duration: 90, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
    { id: "d2-4", start_time: "13:30", duration: 60, title_az: "Nahar", title_en: "Lunch", icon: "food" },
    { id: "d2-5", start_time: "14:30", duration: 90, title_az: "Bölmə iclasları", title_en: "Section Meetings", room: "All halls" },
    { id: "d2-6", start_time: "16:00", duration: 30, title_az: "Qəhvə fasiləsi", title_en: "Coffee Break", icon: "coffee" },
    { id: "d2-7", start_time: "16:30", duration: 30, title_az: "Konfransın bağlanış mərasimi", title_en: "Closing Ceremony", room: "Plenary Hall", is_featured: true },
  ];

  const day1Items = (schedule[1] && schedule[1].length > 0) ? schedule[1] : defaultDay1;
  const day2Items = (schedule[2] && schedule[2].length > 0) ? schedule[2] : defaultDay2;
  const items = day === 1 ? day1Items : day2Items;

  const dayInfo = {
    1: { l: t.day1, d: t.day1Date },
    2: { l: t.day2, d: t.day2Date },
  };

  return (
    <section id="programme" ref={ref} className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
            <span className="w-8 h-px bg-gold" /> {t.programmeEyebrow}
          </div>
          <h2 className="font-display font-light leading-[1] text-navy text-balance"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>
            {t.programmeTitle}
          </h2>
          <p className="mt-6 text-[15px] text-ink/70 max-w-lg">
            {isAz
              ? "Konfrans iki gün ərzində Baku Marriott Hotel Boulevard-da keçiriləcək. Yubiley tədbiri 28 oktyabr tarixində."
              : "The conference takes place over two days at Baku Marriott Hotel Boulevard. Jubilee event held on 28 October."
            }
          </p>
        </motion.div>

        {/* Day tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[1, 2].map(d => {
            const active = day === d;
            return (
              <button key={d} onClick={() => setDay(d)}
                      className={`flex items-center gap-4 pl-5 pr-7 py-4 rounded-full transition-all border ${
                        active ? "bg-navy text-white border-navy"
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
            {items.map((s, i) => {
              const isBreak = s.icon === "coffee" || s.icon === "food";
              return (
                <motion.div key={s.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={`grid grid-cols-12 gap-6 py-6 border-b border-navy/10 hover:bg-cream transition-colors ${
                              s.is_featured ? "bg-[#fdfaf2]" : ""
                            }`}>
                  <div className="col-span-3 lg:col-span-2 pl-2">
                    <div className="font-display text-[26px] text-navy tabular-nums">{s.start_time}</div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 mt-1">
                      <Clock className="w-3 h-3 inline mr-1 -mt-0.5" /> {s.duration || 60} min
                    </div>
                  </div>
                  <div className="col-span-9 lg:col-span-10">
                    {s.is_featured && (
                      <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-gold font-semibold mb-2">
                        <Award className="w-3 h-3" /> {t.featured}
                      </div>
                    )}
                    <h3 className={`font-display ${isBreak ? "text-[18px] text-ink/60 italic" : "text-[20px] text-navy"} leading-snug`}>
                      {isBreak && (s.icon === "coffee" ? <Coffee className="w-4 h-4 inline mr-2 -mt-0.5" /> : "🍽️ ")}
                      {isAz ? s.title_az : s.title_en}
                    </h3>
                    {(s.speaker_name_az || s.speaker_name_en) && (
                      <div className="mt-1.5 text-[13px] text-ink/65">
                        {isAz ? s.speaker_name_az : s.speaker_name_en}
                      </div>
                    )}
                    {s.room && (
                      <div className="mt-2 flex items-center gap-2 text-[12.5px] text-ink/55">
                        <MapPin className="w-3.5 h-3.5" /> {s.room}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Jubilee day note */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-navy-deep/95 to-navy text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2">
                {isAz ? "28 Oktyabr 2026" : "28 October 2026"}
              </div>
              <h4 className="font-display text-[20px] mb-2">
                {isAz ? "Yubiley tədbirləri günü" : "Jubilee Day"}
              </h4>
              <p className="text-[14px] text-white/75 leading-relaxed">
                {isAz
                  ? "Heydər Əliyev Mərkəzində açılış mərasimi (11:00–13:00), nahar “Suraxanı” gəmi muzeyində, mədəni proqram və furşet ADDA-da."
                  : "Opening ceremony at the Heydar Aliyev Center (11:00–13:00), lunch at the “Surakhani” ship museum, cultural programme and reception at ADDA."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
