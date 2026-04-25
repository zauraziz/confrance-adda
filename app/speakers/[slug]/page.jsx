import { getSpeakerBySlug, getMenuPages } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const sp = await getSpeakerBySlug(params.slug);
  if (!sp) return { title: 'Spiker tapılmadı' };
  return { title: sp.name_az + ' · ADDA Konfrans', description: sp.role_az || sp.role_en };
}

export default async function Page({ params }) {
  const sp = await getSpeakerBySlug(params.slug);
  const menuPages = await getMenuPages();
  if (!sp) notFound();

  return (
    <>
      <PublicHeader menuPages={menuPages} />
      <article className="pt-32 pb-24 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Link href="/#speakers" className="inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy mb-10">← Bütün spikerlər</Link>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              {sp.photo_url ? <img src={sp.photo_url} alt={sp.name_az} className="w-full aspect-[3/4] object-cover rounded-2xl" />
              : <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-display text-6xl">
                  {(sp.name_az||'').split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>}
            </div>
            <div className="md:col-span-2">
              <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold mb-4">{sp.country}</div>
              <h1 className="font-display text-5xl text-navy leading-tight mb-3">{sp.name_az}</h1>
              <p className="text-lg text-ink/70 mb-2">{sp.name_en}</p>
              <p className="text-base text-navy/80 font-medium mb-8">{sp.role_az}</p>
              {sp.bio_az && <div><h2 className="font-display text-2xl text-navy mt-10 mb-4">Bioqrafiya</h2><div className="text-ink/75 leading-[1.8] whitespace-pre-line">{sp.bio_az}</div></div>}
            </div>
          </div>
        </div>
      </article>
      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
