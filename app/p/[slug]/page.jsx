import { getPageBySlug, getMenuPages } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { ChevronRight, Home } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: 'Səhifə tapılmadı' };
  return { title: `${page.title_az} · ADDA Konfrans`, description: page.meta_desc_az };
}

function renderContent(content) {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-3" />;

    const headingMatch = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (headingMatch) {
      return (
        <p key={i} className="my-3">
          <strong className="text-navy font-semibold">{headingMatch[1]}:</strong>{' '}
          <span className="text-ink/80">{headingMatch[2]}</span>
        </p>
      );
    }

    const fullBoldMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (fullBoldMatch) {
      return (
        <h3 key={i} className="font-display text-2xl text-navy mt-8 mb-4">{fullBoldMatch[1]}</h3>
      );
    }

    if (line.startsWith('- ')) {
      return (
        <div key={i} className="flex items-start gap-3 my-2">
          <span className="text-gold mt-2 shrink-0">•</span>
          <span className="text-ink/80">{line.substring(2)}</span>
        </div>
      );
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="my-3 text-ink/80 leading-[1.8]">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-navy font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
}

export default async function DynamicPage({ params }) {
  // Etraflı səhifəsini Haqqında bölməsinə yönləndir
  if (params.slug === 'etrafli' || params.slug === 'etraflı') {
    redirect('/#about');
  }

  const page = await getPageBySlug(params.slug);
  const menuPages = await getMenuPages();
  if (!page) notFound();

  return (
    <>
      <PublicHeader menuPages={menuPages} />

      <section className="relative pt-32 pb-16 bg-gradient-to-b from-navy-deep via-navy to-navy-dark text-white overflow-hidden">
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
          <nav className="flex items-center gap-2 text-[12px] text-white/60 mb-8">
            <Link href="/" className="flex items-center gap-1 hover:text-gold transition-colors">
              <Home className="w-3.5 h-3.5" /> Ana səhifə
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{page.title_az}</span>
          </nav>

          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
            <span className="w-8 h-px bg-gold" /> ADDA Konfrans
          </div>

          <h1 className="font-display font-light leading-[1] text-balance"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            {page.title_az}
          </h1>

          {page.meta_desc_az && (
            <p className="mt-6 text-[16px] text-white/75 leading-relaxed max-w-2xl">
              {page.meta_desc_az}
            </p>
          )}
        </div>
      </section>

      <article className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="prose prose-lg max-w-none">
            {renderContent(page.content_az)}
          </div>

          <div className="mt-20 pt-12 border-t border-navy/10 flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-navy/60 hover:text-navy transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" /> Ana səhifəyə qayıt
            </Link>
            <Link href="/register"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink px-6 py-3 rounded-full text-[13px] font-semibold transition-all">
              Qeydiyyatdan keç <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>

      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
