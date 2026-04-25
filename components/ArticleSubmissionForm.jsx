"use client";
import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useLang } from "./LangProvider";

export default function ArticleSubmissionForm() {
  const { lang, t } = useLang();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [data, setData] = useState({
    full_name: "", email: "", phone: "", country: "Azərbaycan",
    organization: "", position: "",
    title: "", abstract: "", keywords: "", topic_area: "Dənizçilik təhsili",
    language: lang,
  });
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/articles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: lang }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || (lang === "az" ? "Xəta baş verdi" : "An error occurred"));
      }
      setSubmitted(true);
    } catch (e) { setError(typeof e.message === "string" ? e.message : "Xəta"); }
    finally { setSubmitting(false); }
  };

  const labels = lang === "az" ? {
    eyebrow: "Məqalə göndər",
    title: "Elmi məqalə müraciəti",
    sub: "Konfransa təqdim edilən məqalələr peer-review prosesindən keçir.",
    rules: [
      ["01", "Format və həcm", "Annotasiya 150–300 söz, məqalənin tam mətni 4 000–8 000 söz. APA 7-ci nəşr istinad standartı."],
      ["02", "Mövzu istiqamətləri", "Dənizçilik təhsili, gəmi mühəndisliyi, Xəzər siyasəti, təsnifat və təhlükəsizlik, liman infrastrukturu."],
      ["03", "Dil", "Məqalə Azərbaycan və ya İngilis dillərində qəbul olunur."],
      ["04", "Orijinallıq", "Müraciət olunan iş əvvəllər nəşr olunmamış olmalıdır. Plagiat 15%-dən çox olmamalıdır."],
      ["05", "Müddət", "Annotasiya: 15 mart 2026. Tam mətn: 15 may 2026."],
      ["06", "Geri dönüş", "Bütün bildirişlər e-poçtla göndəriləcək. Cavab müddəti — 14 iş günü."],
    ],
    s1: "1. Müəllif məlumatları",
    s2: "2. Məqalə məlumatları",
    s3: "3. Yoxlama və təsdiq",
    fullName: "Ad Soyad *", email: "E-poçt *", phone: "Telefon", country: "Ölkə",
    organization: "Təşkilat / Universitet", position: "Vəzifə / Elmi dərəcə",
    titleField: "Məqalənin başlığı *", topic: "Mövzu istiqaməti", language: "Yazı dili",
    keywords: "Açar sözlər (5-7 ədəd)", abstract: "Annotasiya (150–300 söz) *",
    consent: "Yuxarıdakı qaydalarla tanış olduğumu və əsərimin orijinal olduğunu təsdiq edirəm.",
    back: "Geri", next: "Davam", submit: "Müraciəti göndər", submitting: "Göndərilir…",
    received: "Müraciətiniz qəbul edildi",
    receivedSub: "Təsdiq məktubu e-poçtunuza göndərildi. Elmi şura 14 iş günü ərzində nəzərdən keçirəcək.",
    words: "söz",
    topicOpts: ["Dənizçilik təhsili","Gəmi mühəndisliyi","Xəzər siyasəti","Təsnifat və təhlükəsizlik","Liman infrastrukturu","Kursant hazırlığı"],
  } : {
    eyebrow: "Submit article",
    title: "Call for papers",
    sub: "Submitted papers undergo peer review.",
    rules: [
      ["01", "Format & length", "Abstract 150–300 words, full paper 4,000–8,000 words. APA 7th edition citations."],
      ["02", "Topic areas", "Maritime education, naval engineering, Caspian policy, classification & safety, port infrastructure."],
      ["03", "Language", "Articles accepted in Azerbaijani or English."],
      ["04", "Originality", "Submission must be unpublished. Plagiarism rate must not exceed 15%."],
      ["05", "Deadlines", "Abstract: 15 March 2026. Full paper: 15 May 2026."],
      ["06", "Response", "All notifications sent via email. Response time — 14 business days."],
    ],
    s1: "1. Author information",
    s2: "2. Article information",
    s3: "3. Review & confirm",
    fullName: "Full name *", email: "Email *", phone: "Phone", country: "Country",
    organization: "Organization / University", position: "Position / Academic title",
    titleField: "Article title *", topic: "Topic area", language: "Language",
    keywords: "Keywords (5-7)", abstract: "Abstract (150–300 words) *",
    consent: "I confirm that I have read the rules and that my work is original.",
    back: "Back", next: "Continue", submit: "Submit application", submitting: "Submitting…",
    received: "Application received",
    receivedSub: "Confirmation has been sent to your email. The committee will respond within 14 business days.",
    words: "words",
    topicOpts: ["Maritime education","Naval engineering","Caspian policy","Classification & safety","Port infrastructure","Cadet training"],
  };

  if (submitted) {
    return (
      <section className="py-32 bg-gradient-to-b from-navy-deep to-navy-dark text-white min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center mb-8">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <h2 className="font-display text-4xl mb-4">{labels.received}</h2>
          <p className="text-white/70 leading-relaxed">{labels.receivedSub}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
              <span className="w-8 h-px bg-gold" /> {labels.eyebrow}
            </div>
            <h2 className="font-display font-light text-5xl mb-6">{labels.title}</h2>
            <p className="text-white/70 mb-10 leading-relaxed">{labels.sub}</p>
            <div className="space-y-5">
              {labels.rules.map(([num, title, body]) => (
                <div key={num} className="flex gap-4">
                  <div className="font-display text-2xl text-gold leading-none w-10">{num}</div>
                  <div>
                    <div className="font-display text-lg mb-1">{title}</div>
                    <div className="text-sm text-white/65 leading-relaxed">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-ink rounded-3xl p-8 lg:p-12 shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                {[1,2,3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i<=step?'bg-gold':'bg-navy/10'}`} />
                ))}
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5" /> {String(error)}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-display text-2xl text-navy mb-6">{labels.s1}</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label={labels.fullName} value={data.full_name} onChange={v=>update('full_name',v)} />
                    <Field label={labels.email} type="email" value={data.email} onChange={v=>update('email',v)} />
                    <Field label={labels.phone} value={data.phone} onChange={v=>update('phone',v)} />
                    <Field label={labels.country} value={data.country} onChange={v=>update('country',v)} />
                    <Field label={labels.organization} full value={data.organization} onChange={v=>update('organization',v)} />
                    <Field label={labels.position} full value={data.position} onChange={v=>update('position',v)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-display text-2xl text-navy mb-6">{labels.s2}</h3>
                  <div className="grid gap-5">
                    <Field label={labels.titleField} full value={data.title} onChange={v=>update('title',v)} />
                    <Select label={labels.topic} value={data.topic_area} onChange={v=>update('topic_area',v)} options={labels.topicOpts} />
                    <Field label={labels.keywords} full value={data.keywords} onChange={v=>update('keywords',v)} />
                    <Textarea label={labels.abstract} rows={8} value={data.abstract} onChange={v=>update('abstract',v)}
                              hint={`${data.abstract.split(/\s+/).filter(Boolean).length} ${labels.words}`} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-display text-2xl text-navy mb-6">{labels.s3}</h3>
                  <div className="space-y-3 text-sm border border-navy/10 rounded-xl p-5 mb-6">
                    <Row k={labels.fullName} v={data.full_name} />
                    <Row k={labels.email} v={data.email} />
                    <Row k={labels.organization} v={data.organization} />
                    <Row k={labels.titleField} v={data.title} />
                    <Row k={labels.topic} v={data.topic_area} />
                    <Row k={labels.abstract} v={`${data.abstract.split(/\s+/).filter(Boolean).length} ${labels.words}`} />
                  </div>
                  <label className="flex items-start gap-3 text-sm text-ink/75 cursor-pointer">
                    <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c9a55a]" />
                    <span>{labels.consent}</span>
                  </label>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between">
                <button onClick={() => step>1 && setStep(step-1)} disabled={step===1}
                        className={`inline-flex items-center gap-2 text-sm font-medium ${step===1?'text-ink/30':'text-navy hover:text-gold'}`}>
                  <ArrowLeft className="w-4 h-4" /> {labels.back}
                </button>
                {step < 3 ? (
                  <button onClick={() => setStep(step+1)}
                          disabled={step===1 ? (!data.full_name||!data.email) : (!data.title||!data.abstract)}
                          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-7 py-3.5 rounded-full text-sm font-semibold disabled:opacity-40">
                    {labels.next} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={submit} disabled={!accepted || submitting}
                          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink px-7 py-3.5 rounded-full text-sm font-semibold disabled:opacity-40">
                    {submitting ? labels.submitting : labels.submit} <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type='text', full }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{label}</span>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
             className="w-full bg-transparent border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
    </label>
  );
}

function Textarea({ label, value, onChange, rows=4, hint }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10.5px] tracking-[0.22em] uppercase text-ink/55">{label}</span>
        {hint && <span className="text-[11px] text-ink/45">{hint}</span>}
      </div>
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)}
                className="w-full border border-navy/15 focus:border-gold outline-none p-3 text-[14px] text-navy rounded-lg" />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)}
              className="w-full bg-transparent border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between border-b border-navy/10 pb-2">
      <span className="text-ink/55">{k}</span>
      <span className="font-medium text-navy">{v||'—'}</span>
    </div>
  );
}
