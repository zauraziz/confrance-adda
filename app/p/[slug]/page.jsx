import { getPageBySlug, getMenuPages } from '@/lib/db';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: 'Səhifə tapılmadı' };
  return { title: `${page.title_az} · ADDA`, description: page.meta_desc_az };
}

export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(params.slug);
  const menuPages = await getMenuPages();
  if (!page) notFound();

  return (
    <>
      <PublicHeader menuPages={menuPages} />
      <article className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <h1 className="font-display text-5xl text-navy leading-tight mb-10">{page.title_az}</h1>
          <div className="prose prose-lg max-w-none text-ink/80 leading-[1.8] whitespace-pre-line">
            {page.content_az}
          </div>
        </div>
      </article>
      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
