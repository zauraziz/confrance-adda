"use client";
import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, AlertCircle, Upload, File, X, Loader2 } from "lucide-react";
import { useLang } from "./LangProvider";

export default function ArticleSubmissionForm({ sections = [] }) {
  const { lang } = useLang();
  const isAz = lang === "az";
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [data, setData] = useState({
    full_name: "", email: "", phone: "", country: "Azərbaycan",
    organization: "", position: "",
    title: "", abstract: "", keywords: "", topic_area: "",
    language: lang,
    file_url: null,
    file_name: null,
    section_id: null,
  });
  const update = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    if (fieldErrors[k]) setFieldErrors(fe => ({ ...fe, [k]: null }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError("");
    if (file.size > 10 * 1024 * 1024) {
      setFileError(isAz ? "Fayl 10 MB-dan böyükdür" : "File exceeds 10 MB");
      return;
    }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setFileError(isAz ? "Yalnız PDF, DOC, DOCX qəbul olunur" : "Only PDF, DOC, DOCX accepted");
      return;
    }
    setUploadingFile(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "articles");
      fd.append("kind", "document");
      fd.append("public", "true");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Yükləmə uğursuz");
      update("file_url", j.url);
      update("file_name", file.name);
    } catch (e) {
      setFileError(e.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const wordCount = data.abstract.split(/\s+/).filter(Boolean).length;

  // VALIDATION FUNCTIONS - hər addım üçün
  const validateStep = (s) => {
    const errors = {};
    const M = (k) => isAz ? errMessages.az[k] : errMessages.en[k];

    if (s === 1) {
      if (!data.full_name.trim()) errors.full_name = M("required");
      else if (data.full_name.trim().length < 2) errors.full_name = M("nameShort");

      if (!data.email.trim()) errors.email = M("required");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = M("invalidEmail");

      if (data.phone && data.phone.trim().length < 5) errors.phone = M("phoneShort");
    }

    if (s === 2) {
      if (!data.title.trim()) errors.title = M("required");
      else if (data.title.trim().length < 8) errors.title = M("titleShort");

      if (!data.abstract.trim()) errors.abstract = M("required");
      else if (wordCount < 50) errors.abstract = M("abstractShort").replace("{n}", wordCount);
      else if (wordCount > 300) errors.abstract = M("abstractLong").replace("{n}", wordCount);
    }

    return errors;
  };

  const errMessages = {
    az: {
      required: "Bu sahə mütləq doldurulmalıdır",
      nameShort: "Ad ən azı 2 simvoldan ibarət olmalıdır",
      invalidEmail: "Düzgün e-poçt ünvanı daxil edin",
      phoneShort: "Telefon nömrəsi çox qısadır",
      titleShort: "Başlıq ən azı 8 simvoldan ibarət olmalıdır",
      abstractShort: "Annotasiya ən azı 50 söz olmalıdır (hazırda {n} söz)",
      abstractLong: "Annotasiya 300 sözdən çox olmamalıdır (hazırda {n} söz)",
      stepIncomplete: "Növbəti mərhələyə keçmək üçün qırmızı ilə işarələnmiş sahələri doldurun",
    },
    en: {
      required: "This field is required",
      nameShort: "Name must be at least 2 characters",
      invalidEmail: "Enter a valid email address",
      phoneShort: "Phone number is too short",
      titleShort: "Title must be at least 8 characters",
      abstractShort: "Abstract must be at least 50 words (currently {n} words)",
      abstractLong: "Abstract must not exceed 300 words (currently {n} words)",
      stepIncomplete: "Please fill in the highlighted fields to continue",
    },
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(isAz ? errMessages.az.stepIncomplete : errMessages.en.stepIncomplete);
      return;
    }
    setError("");
    setFieldErrors({});
    setStep(step + 1);
  };

  const submit = async () => {
    const allErrors = { ...validateStep(1), ...validateStep(2) };
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      setError(isAz ? errMessages.az.stepIncomplete : errMessages.en.stepIncomplete);
      // step 1-ə qayıt əgər ilkin xətalar varsa
      if (allErrors.full_name || allErrors.email) setStep(1);
      else if (allErrors.title || allErrors.abstract) setStep(2);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/articles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: lang }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        let msg;
        if (Array.isArray(j.error)) {
          msg = j.error.map(e => e.path ? `${e.path.join('.')}: ${e.message}` : e.message).join(', ');
        } else if (typeof j.error === 'object' && j.error !== null) {
          msg = JSON.stringify(j.error);
        } else {
          msg = j.error || (isAz ? "Xəta baş verdi" : "An error occurred");
        }
        throw new Error(msg);
      }
      setSubmitted(true);
    } catch (e) {
      setError(typeof e.message === "string" ? e.message : (isAz ? "Xəta baş verdi" : "An error occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  const labels = isAz ? {
    eyebrow: "Məqalə göndər",
    title: "Elmi məqalə müraciəti",
    sub: "Konfransa təqdim edilən məqalələr peer-review prosesindən keçir.",
    rules: [
      ["01", "Format və həcm", "Annotasiya 50–300 söz, məqalənin tam mətni 4 000–8 000 söz. APA 7-ci nəşr istinad standartı."],
      ["02", "Bölmələr", "6 elmi istiqamət: gəmiqayırma, AI, energetika, ekologiya, iqtisadiyyat, hüquq."],
      ["03", "Dil", "Məqalə Azərbaycan, İngilis və ya Rus dillərində qəbul olunur."],
      ["04", "Orijinallıq", "Müraciət olunan iş əvvəllər nəşr olunmamış olmalıdır. Plagiat 15%-dən çox olmamalıdır."],
      ["05", "Müddət", "Annotasiya: 15 avqust 2026. Tam mətn: 15 sentyabr 2026."],
      ["06", "Fayl", "PDF, DOC və ya DOCX formatında, maks. 10 MB."],
    ],
    s1: "1. Müəllif məlumatları",
    s2: "2. Məqalə məlumatları",
    s3: "3. Yoxlama və təsdiq",
    fullName: "Ad Soyad", email: "E-poçt", phone: "Telefon", country: "Ölkə",
    organization: "Təşkilat / Universitet", position: "Vəzifə / Elmi dərəcə",
    titleField: "Məqalənin başlığı", topic: "Bölmə",
    keywords: "Açar sözlər (5-7 ədəd)", abstract: "Annotasiya",
    fileLabel: "Tam məqalə faylı (PDF, DOC, DOCX — maks. 10 MB)",
    consent: "Qaydalarla tanış olduğumu və əsərimin orijinal olduğunu təsdiq edirəm.",
    back: "Geri", next: "Davam", submit: "Müraciəti göndər", submitting: "Göndərilir…",
    received: "Müraciətiniz qəbul edildi",
    receivedSub: "Təsdiq məktubu e-poçtunuza göndərildi. Elmi şura 14 iş günü ərzində nəzərdən keçirəcək.",
    words: "söz",
    selectSection: "-- Bölmə seçin --",
    consentRequired: "Davam etmək üçün qaydaları təsdiq edin",
  } : {
    eyebrow: "Submit article",
    title: "Call for papers",
    sub: "Submitted papers undergo peer review.",
    rules: [
      ["01", "Format & length", "Abstract 50–300 words, full paper 4,000–8,000 words. APA 7th edition citations."],
      ["02", "Sections", "6 scientific tracks: shipbuilding, AI, energy, ecology, economics, law."],
      ["03", "Language", "Articles accepted in Azerbaijani, English or Russian."],
      ["04", "Originality", "Submission must be unpublished. Plagiarism rate must not exceed 15%."],
      ["05", "Deadlines", "Abstract: 15 August 2026. Full paper: 15 September 2026."],
      ["06", "File", "PDF, DOC or DOCX format, max. 10 MB."],
    ],
    s1: "1. Author information",
    s2: "2. Article information",
    s3: "3. Review & confirm",
    fullName: "Full name", email: "Email", phone: "Phone", country: "Country",
    organization: "Organization / University", position: "Position / Academic title",
    titleField: "Article title", topic: "Section",
    keywords: "Keywords (5-7)", abstract: "Abstract",
    fileLabel: "Full article file (PDF, DOC, DOCX — max. 10 MB)",
    consent: "I confirm that I have read the rules and that my work is original.",
    back: "Back", next: "Continue", submit: "Submit application", submitting: "Submitting…",
    received: "Application received",
    receivedSub: "Confirmation has been sent to your email. The committee will respond within 14 business days.",
    words: "words",
    selectSection: "-- Select section --",
    consentRequired: "Please confirm the rules to continue",
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
                <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-display text-2xl text-navy mb-6">{labels.s1}</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label={labels.fullName} required value={data.full_name} onChange={v=>update('full_name',v)} error={fieldErrors.full_name} />
                    <Field label={labels.email} required type="email" value={data.email} onChange={v=>update('email',v)} error={fieldErrors.email} />
                    <Field label={labels.phone} value={data.phone} onChange={v=>update('phone',v)} error={fieldErrors.phone} />
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
                    <Field label={labels.titleField} required full value={data.title} onChange={v=>update('title',v)} error={fieldErrors.title} />
                    {sections.length > 0 && (
                      <Select label={labels.topic} value={data.section_id || ''} onChange={v=>update('section_id', Number(v) || null)}
                              options={sections.map(s => ({ v: s.id, l: `${s.number}. ${isAz ? s.title_az : s.title_en}` }))}
                              placeholder={labels.selectSection} />
                    )}
                    <Field label={labels.keywords} full value={data.keywords} onChange={v=>update('keywords',v)} />
                    <Textarea label={labels.abstract} required rows={8} value={data.abstract}
                              onChange={v=>update('abstract',v)}
                              hint={`${wordCount} ${labels.words} (50-300)`}
                              error={fieldErrors.abstract} />

                    {/* FILE UPLOAD */}
                    <div>
                      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">
                        {labels.fileLabel}
                      </span>
                      {data.file_url ? (
                        <div className="flex items-center justify-between p-3 bg-cream rounded-lg border border-navy/10">
                          <div className="flex items-center gap-2 min-w-0">
                            <File className="w-4 h-4 text-gold shrink-0" />
                            <span className="text-sm text-navy truncate">{data.file_name}</span>
                          </div>
                          <button type="button"
                                  onClick={() => { update('file_url', null); update('file_name', null); }}
                                  className="text-ink/40 hover:text-red-500 shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
                          <div className={`flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed text-sm transition-all ${
                            uploadingFile ? 'border-gold bg-gold/5 text-gold-dark'
                                          : 'border-navy/20 text-navy/60 hover:border-navy/40 hover:bg-navy/5'
                          }`}>
                            {uploadingFile ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> {isAz ? "Yüklənir..." : "Uploading..."}</>
                            ) : (
                              <><Upload className="w-4 h-4" /> {isAz ? "Fayl seç" : "Choose file"}</>
                            )}
                          </div>
                        </label>
                      )}
                      {fileError && <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                      </div>}
                    </div>
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
                    <Row k={labels.topic} v={
                      data.section_id ? sections.find(s => s.id === data.section_id)?.[isAz ? 'title_az' : 'title_en'] : '—'
                    } />
                    <Row k={labels.abstract} v={`${wordCount} ${labels.words}`} />
                    <Row k={isAz ? "Fayl" : "File"} v={data.file_name || '—'} />
                  </div>
                  <label className={`flex items-start gap-3 text-sm cursor-pointer p-3 rounded-lg transition-colors ${
                    !accepted && error ? 'bg-red-50 border border-red-200' : ''
                  }`}>
                    <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c9a55a]" />
                    <span className={!accepted && error ? 'text-red-700' : 'text-ink/75'}>{labels.consent}</span>
                  </label>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between">
                <button onClick={() => { if (step>1) { setStep(step-1); setError(""); setFieldErrors({}); }}}
                        disabled={step===1}
                        className={`inline-flex items-center gap-2 text-sm font-medium ${step===1?'text-ink/30':'text-navy hover:text-gold'}`}>
                  <ArrowLeft className="w-4 h-4" /> {labels.back}
                </button>
                {step < 3 ? (
                  <button onClick={handleNext}
                          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep text-white px-7 py-3.5 rounded-full text-sm font-semibold">
                    {labels.next} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => {
                            if (!accepted) {
                              setError(isAz ? labels.consentRequired : labels.consentRequired);
                              return;
                            }
                            submit();
                          }} disabled={submitting}
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

function Field({ label, value, onChange, type='text', full, required, error }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className={`block text-[10.5px] tracking-[0.22em] uppercase mb-2 ${error ? 'text-red-600' : 'text-ink/55'}`}>
        {label}{required && ' *'}
      </span>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
             className={`w-full bg-transparent border-b outline-none py-2.5 text-[15px] text-navy transition-colors ${
               error ? 'border-red-400 focus:border-red-600' : 'border-navy/15 focus:border-gold'
             }`} />
      {error && <div className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </div>}
    </label>
  );
}

function Textarea({ label, value, onChange, rows=4, hint, required, error }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10.5px] tracking-[0.22em] uppercase ${error ? 'text-red-600' : 'text-ink/55'}`}>
          {label}{required && ' *'}
        </span>
        {hint && <span className="text-[11px] text-ink/45">{hint}</span>}
      </div>
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)}
                className={`w-full border outline-none p-3 text-[14px] text-navy rounded-lg transition-colors ${
                  error ? 'border-red-400 focus:border-red-600' : 'border-navy/15 focus:border-gold'
                }`} />
      {error && <div className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </div>}
    </label>
  );
}

function Select({ label, value, onChange, options, placeholder = "-- Select --" }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)}
              className="w-full bg-transparent border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy/10 pb-2 last:border-0 last:pb-0">
      <span className="text-ink/55">{k}</span>
      <span className="font-medium text-navy text-right truncate max-w-[60%]">{v||'—'}</span>
    </div>
  );
}
