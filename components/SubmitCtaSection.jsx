"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, UserPlus } from "lucide-react";
import { useLang } from "./LangProvider";

export default function SubmitCtaSection() {
  const { lang } = useLang();
  const isAz = lang === "az";

  return (
    <section className="py-32 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white relative overflow-hidden">
      <svg className="absolute -left-40 -bottom-40 w-[600px] h-[600px] opacity-[0.05]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="42" stroke="white" strokeWidth="0.4" fill="none" />
      </svg>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
            <span className="w-8 h-px bg-gold" />
            {isAz ? "İştirak imkanları" : "Participate"}
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display font-light leading-[1] text-balance mb-6"
              style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>
            {isAz ? "Konfransa qoşulun" : "Join the conference"}
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-2xl mx-auto">
            {isAz
              ? "Elmi məqalə təqdim edə və ya konfransda dinləyici kimi iştirak edə bilərsiniz. Hibrid format sayəsində onlayn qoşulmaq da mümkündür."
              : "Submit a research paper or register as a participant. Thanks to the hybrid format, you can also join online."
            }
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Məqalə göndər */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5 }}
                      className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/[0.1] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display text-2xl mb-3">
              {isAz ? "Məqalə göndər" : "Submit article"}
            </h3>
            <p className="text-[14px] text-white/65 leading-relaxed mb-6">
              {isAz
                ? "Elmi məqalə və ya annotasiya təqdim edin. Peer-review prosesindən keçən məqalələr konfrans toplusunda dərc ediləcək."
                : "Submit your research paper or abstract. Peer-reviewed papers will be published in the conference proceedings."
              }
            </p>
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-6 py-3.5 rounded-full text-[13.5px] font-semibold transition-all">
              {isAz ? "Məqalə göndər" : "Submit article"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Qeydiyyat */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/[0.1] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-6">
              <UserPlus className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display text-2xl mb-3">
              {isAz ? "İştirakçı qeydiyyatı" : "Register to attend"}
            </h3>
            <p className="text-[14px] text-white/65 leading-relaxed mb-6">
              {isAz
                ? "Konfransda əyani və ya onlayn dinləyici kimi iştirak edin. Bütün bölmə iclaslarına qoşula bilərsiniz."
                : "Attend as an in-person or online participant. Access all section meetings and plenary sessions."
              }
            </p>
            <Link href="/register"
                  className="group inline-flex items-center gap-3 border border-white/40 hover:border-white text-white px-6 py-3.5 rounded-full text-[13.5px] font-semibold transition-all hover:bg-white/10">
              {isAz ? "Qeydiyyatdan keç" : "Register now"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
