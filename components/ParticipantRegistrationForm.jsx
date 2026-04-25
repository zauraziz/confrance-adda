"use client";
import { useState } from "react";
import { Check, ArrowRight, AlertCircle, MapPin, Monitor, Users } from "lucide-react";
import { useLang } from "./LangProvider";

export default function ParticipantRegistrationForm() {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    full_name: "", email: "", phone: "", country: "Azərbaycan",
    organization: "", position: "",
    participation_type: "onsite",
    dietary_requirements: "",
    accommodation_needed: false,
    language: lang,
    notes: "",
  });
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const isAz = lang === "az";

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: lang }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || (isAz ? "Xəta baş verdi" : "An error occurred"));
      }
      setSubmitted(true);
    } catch (e) {
      setError(typeof e.message === "string" ? e.message : "Xəta");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-32 bg-gradient-to-b from-navy-deep to-navy-dark text-white min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center mb-8">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <h2 className="font-display text-4xl mb-4">
            {isAz ? "Qeydiyyatınız qəbul edildi" : "Registration confirmed"}
          </h2>
          <p className="text-white/70 leading-relaxed">
            {isAz
              ? `Təsdiq məktubu ${data.email} ünvanına göndərildi. ${data.participation_type !== "onsite" ? "Onlayn iştirak linki konfransdan 24 saat əvvəl göndəriləcək." : "Konfrans Baku Marriott Hotel Boulevard-da keçiriləcəkdir."}`
              : `Confirmation has been sent to ${data.email}. ${data.participation_type !== "onsite" ? "Online access link will be sent 24 hours before the conference." : "The conference will be held at Baku Marriott Hotel Boulevard."}`
            }
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sol — Məlumat */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
              <span className="w-8 h-px bg-gold" /> {isAz ? "Konfrans qeydiyyatı" : "Conference registration"}
            </div>
            <h2 className="font-display font-light text-5xl mb-6">
              {isAz ? "Konfransa qoşulun" : "Join the conference"}
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              {isAz
                ? "29-30 oktyabr 2026-cı il tarixlərində Baku Marriott Hotel Boulevard-da keçiriləcək \"İnnovativ Dənizçilik və Dayanıqlı İnkişaf\" Beynəlxalq Elmi-Praktiki Konfransda əyani və ya onlayn iştirak edə bilərsiniz."
                : "Join the International Scientific-Practical Conference on \"Innovative Maritime and Sustainable Development\" on 29-30 October 2026 at Baku Marriott Hotel Boulevard, in-person or online."
              }
            </p>

            <div className="space-y-6 text-white/80">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-display text-lg text-white mb-1">{isAz ? "Məkan" : "Venue"}</div>
                  <div className="text-sm text-white/65">Baku Marriott Hotel Boulevard, Bakı</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-display text-lg text-white mb-1">{isAz ? "Hibrid format" : "Hybrid format"}</div>
                  <div className="text-sm text-white/65">
                    {isAz ? "Əyani və onlayn iştirak imkanı" : "In-person and online participation available"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-display text-lg text-white mb-1">{isAz ? "Əlaqə" : "Contact"}</div>
                  <div className="text-sm text-white/65 space-y-1">
                    <div>Samirə Gözəlova — samira.gozalova@adda.edu.az</div>
                    <div>Əli Əliyev — +994 50 516 34 00</div>
                    <div>Qulu Quliyev — +994 50 516 34 00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ — Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-ink rounded-3xl p-8 lg:p-12 shadow-2xl">
              <h3 className="font-display text-2xl text-navy mb-6">
                {isAz ? "Qeydiyyat formu" : "Registration form"}
              </h3>

              {error && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
                </div>
              )}

              {/* İştirak növü */}
              <div className="mb-6">
                <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-3">
                  {isAz ? "İştirak növü" : "Participation type"}
                </span>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { v: "onsite", icon: MapPin, az: "Əyani iştirak", en: "In-person" },
                    { v: "online", icon: Monitor, az: "Onlayn izləmə", en: "Online" },
                    { v: "both", icon: Users, az: "Hər ikisi", en: "Both" },
                  ].map(({ v, icon: Ic, az, en }) => (
                    <label key={v} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      data.participation_type === v ? "border-gold bg-gold/5" : "border-navy/10 hover:border-navy/30"
                    }`}>
                      <input type="radio" name="ptype" checked={data.participation_type === v}
                             onChange={() => update("participation_type", v)} className="w-4 h-4 accent-[#c9a55a]" />
                      <Ic className="w-4 h-4 text-navy" />
                      <span className="text-sm font-medium text-navy">{isAz ? az : en}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Şəxsi məlumatlar */}
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <Field label={isAz ? "Ad Soyad *" : "Full name *"} value={data.full_name} onChange={v => update("full_name", v)} />
                <Field label={isAz ? "E-poçt *" : "Email *"} type="email" value={data.email} onChange={v => update("email", v)} />
                <Field label={isAz ? "Telefon" : "Phone"} value={data.phone} onChange={v => update("phone", v)} />
                <Field label={isAz ? "Ölkə" : "Country"} value={data.country} onChange={v => update("country", v)} />
                <Field label={isAz ? "Təşkilat / Universitet" : "Organization"} full value={data.organization} onChange={v => update("organization", v)} />
                <Field label={isAz ? "Vəzifə / Elmi dərəcə" : "Position / Title"} full value={data.position} onChange={v => update("position", v)} />
              </div>

              {/* Əyani iştirak üçün əlavə suallar */}
              {data.participation_type !== "online" && (
                <div className="border-t border-navy/10 pt-6 mb-6 space-y-5">
                  <Field label={isAz ? "Qida tələbləri (vegetarian, halal və s.)" : "Dietary requirements"} value={data.dietary_requirements} onChange={v => update("dietary_requirements", v)} />
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={data.accommodation_needed}
                           onChange={e => update("accommodation_needed", e.target.checked)} className="w-4 h-4 accent-[#c9a55a]" />
                    {isAz ? "Otel yerləşdirmə tələb edirəm" : "I need hotel accommodation"}
                  </label>
                </div>
              )}

              {/* Qeydlər */}
              <div className="mb-8">
                <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">
                  {isAz ? "Əlavə qeydlər (opsional)" : "Additional notes (optional)"}
                </span>
                <textarea rows={3} value={data.notes} onChange={e => update("notes", e.target.value)}
                          className="w-full border border-navy/15 focus:border-gold outline-none p-3 text-[14px] text-navy rounded-lg" />
              </div>

              <button onClick={submit} disabled={!data.full_name || !data.email || submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink py-4 rounded-full text-[14px] font-semibold disabled:opacity-40 transition-all">
                {submitting ? (isAz ? "Göndərilir..." : "Submitting...") : (isAz ? "Qeydiyyatdan keç" : "Register")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
             className="w-full bg-transparent border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
    </label>
  );
}
