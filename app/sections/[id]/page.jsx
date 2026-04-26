import { sql, getMenuPages } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { ChevronRight, Home, Users, BookOpen, Award } from 'lucide-react';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

async function getSection(id) {
  try {
    const rows = await sql`SELECT * FROM sections WHERE id = ${id} LIMIT 1`;
    return rows[0] || null;
  } catch { return null; }
}

async function getOtherSections(currentId) {
  try {
    const rows = await sql`SELECT id, number, title_az, title_en FROM sections WHERE is_active = true AND id != ${currentId} ORDER BY sort_order, number`;
    return rows;
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const section = await getSection(params.id);
  if (!section) return { title: 'Bölmə tapılmadı' };
  return {
    title: `${section.title_az} · ADDA Konfrans`,
    description: section.description_az,
  };
}

export default async function SectionPage({ params }) {
  const [section, others, menuPages] = await Promise.all([
    getSection(params.id),
    getOtherSections(params.id),
    getMenuPages(),
  ]);
  if (!section) notFound();

  // Topics list - description-i nöqtələrə bölək
  const topicsAz = (section.description_az || '').split('.').map(s => s.trim()).filter(s => s.length > 5);
  const topicsEn = (section.description_en || '').split('.').map(s => s.trim()).filter(s => s.length > 5);

  return (
    <>
      <PublicHeader menuPages={menuPages} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white overflow-hidden">
        <svg className="absolute -right-40 -top-20 w-[500px] h-[500px] opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="58" stroke="white" strokeWidth="0.3" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 360 / 24) * Math.PI / 180;
            return <line key={i}
              x1={100 + Math.cos(a) * 60} y1={100 + Math.sin(a) * 60}
              x2={100 + Math.cos(a) * 98} y2={100 + Math.sin(a) * 98}
              stroke="white" strokeWidth="0.3" />;
          })}
        </svg>

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-white/60 mb-8">
            <Link href="/" className="flex items-center gap-1 hover:text-gold transition-colors">
              <Home className="w-3.5 h-3.5" /> Ana səhifə
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#sections" className="hover:text-gold transition-colors">Bölmələr</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Bölmə {section.number}</span>
          </nav>

          {/* Number badge */}
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-display text-[100px] leading-none text-gold">0{section.number}</span>
            <span className="text-[12px] tracking-[0.3em] uppercase text-gold/70 mb-3">BÖLMƏ</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-light leading-[1.1] text-balance max-w-3xl"
              style={{ fontSize: "clamp(34px, 5vw, 60px)" }}>
            {section.title_az}
          </h1>
          <p className="mt-4 text-[16px] text-white/65 italic">{section.title_en}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Bölmə haqqında</span>
                </div>
                <p className="text-[16px] leading-[1.8] text-ink/80">
                  {section.description_az}
                </p>
              </div>

              {/* Topics — bölmədə dinlənilcək mövzular */}
              {topicsAz.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-6">
                    <Award className="w-4 h-4 text-gold" />
                    <span>Bölmədə dinlənilcək mövzular</span>
                  </div>
                  <ul className="space-y-3">
                    {topicsAz.map((topic, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="font-display text-gold text-lg leading-none mt-1 shrink-0">·</span>
                        <span className="text-[15px] text-ink/80 leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* English version */}
              {section.description_en && (
                <div className="mb-12 pt-8 border-t border-navy/10">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-ink/40 mb-3">English</div>
                  <h3 className="font-display text-[22px] text-navy mb-4">{section.title_en}</h3>
                  <p className="text-[14.5px] leading-relaxed text-ink/70">{section.description_en}</p>
                </div>
              )}

              {/* Russian version (if available) */}
              {section.description_ru && (
                <div className="mb-12 pt-8 border-t border-navy/10">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-ink/40 mb-3">Русский</div>
                  {section.title_ru && (
                    <h3 className="font-display text-[22px] text-navy mb-4">{section.title_ru}</h3>
                  )}
                  <p className="text-[14.5px] leading-relaxed text-ink/70">{section.description_ru}</p>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-cream rounded-2xl p-7 sticky top-24">
                {/* Chairs */}
                {section.chairs && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gold mb-4">
                      <Users className="w-3.5 h-3.5" /> Həmsədrlər
                    </div>
                    <div className="space-y-2">
                      {section.chairs.split(',').map((chair, i) => (
                        <div key={i} className="text-[14px] text-navy">
                          {chair.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-6 border-t border-navy/10">
                  <p className="text-[13px] text-ink/65 mb-4 leading-relaxed">
                    Bu bölmədə məruzə təqdim etmək üçün məqalə göndərin
                  </p>
                  <Link href="/submit-article"
                        className="block text-center bg-navy hover:bg-navy-deep text-white py-3 rounded-full text-[13px] font-semibold transition-colors">
                    Məqalə göndər
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* OTHER SECTIONS */}
          {others.length > 0 && (
            <div className="mt-24 pt-12 border-t border-navy/10">
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-navy/60 mb-8">
                <span className="w-8 h-px bg-gold" /> Digər bölmələr
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10">
                {others.map(s => (
                  <Link key={s.id} href={`/sections/${s.id}`}
                        className="bg-white p-6 hover:bg-cream transition-colors group">
                    <div className="font-display text-[36px] text-gold mb-3 leading-none">0{s.number}</div>
                    <h4 className="font-display text-[16px] text-navy leading-tight group-hover:text-navy-deep transition-colors">
                      {s.title_az}
                    </h4>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-ink/45 group-hover:text-gold transition-colors">
                      Ətraflı <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BACK */}
          <div className="mt-12">
            <Link href="/#sections" className="inline-flex items-center gap-2 text-[13px] text-navy/60 hover:text-navy transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" /> Bütün bölmələrə qayıt
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
