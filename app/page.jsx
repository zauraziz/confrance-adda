import { getSpeakers, getSessionsByDay, getSiteContent, getMenuPages, sql } from "@/lib/db";
import PublicHeader from "@/components/PublicHeader";
import HomeHero from "@/components/HomeHero";
import HomeAbout from "@/components/HomeAbout";
import HomeSections from "@/components/HomeSections";
import HomeSpeakers from "@/components/HomeSpeakers";
import HomeProgramme from "@/components/HomeProgramme";
import HomePartners from "@/components/HomePartners";
import PublicFooter from "@/components/PublicFooter";
import MarqueeStrip from "@/components/MarqueeStrip";
import SubmitCtaSection from "@/components/SubmitCtaSection";

export const revalidate = 60;

export default async function Home() {
  const [speakers, day1, day2, day3, content, menuPages, sections, partners, settings] = await Promise.all([
    getSpeakers(),
    getSessionsByDay(1),
    getSessionsByDay(2),
    getSessionsByDay(3),
    getSiteContent(),
    getMenuPages(),
    sql`SELECT * FROM sections WHERE is_active = true ORDER BY sort_order, number`.catch(() => []),
    sql`SELECT * FROM partners WHERE is_active = true ORDER BY sort_order`.catch(() => []),
    sql`SELECT key, value FROM site_settings`.catch(() => []),
  ]);

  const settingsMap = {};
  (settings || []).forEach(s => { settingsMap[s.key] = s.value; });

  return (
    <div className="font-sans antialiased text-ink bg-white">
      <PublicHeader menuPages={menuPages} />
      <HomeHero content={content.hero || {}} settings={settingsMap} />
      <MarqueeStrip />
      <HomeAbout content={content.about || {}} />
      <HomeSections sections={sections} />
      <HomeSpeakers speakers={speakers} />
      <HomeProgramme schedule={{ 1: day1, 2: day2, 3: day3 }} />
      <HomePartners partners={partners} />
      <SubmitCtaSection />
      <PublicFooter content={content.footer || {}} menuPages={menuPages} />
    </div>
  );
}
