"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { useLang } from "./LangProvider";

export default function SubmitCtaSection() {
  const { t } = useLang();
  return (
    <section className="py-32 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white relative overflow-hidden">
      <svg className="absolute -left-40 -bottom-40 w-[600px] h-[600px] opacity-[0.05]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.4" fill="none" />
        <circle cx="100" cy="100" r="42" stroke="white" strokeWidth="0.4" fill="none" />
      </svg>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
              <span className="w-8 h-px bg-gold" /> {t.submitEyebrow}
            </div>
            <h2 className="font-display font-light leading-[1] text-balance mb-6"
                style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>
              {t.submitTitle}
            </h2>
            <p className="text-[15px] text-white/70 leading-relaxed max-w-lg">{t.submitSub}</p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <Link href="/submit-article"
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink px-8 py-5 rounded-full text-[14px] font-semibold transition-all">
              <FileText className="w-5 h-5" /> {t.submitCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
