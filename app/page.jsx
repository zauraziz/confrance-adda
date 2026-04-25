import { getSpeakers, getSessionsByDay, getSiteContent, getMenuPages } from "@/lib/db";
import PublicHeader from "@/components/PublicHeader";
import HomeHero from "@/components/HomeHero";
import HomeAbout from "@/components/HomeAbout";
import HomeSpeakers from "@/components/HomeSpeakers";
import HomeProgramme from "@/components/HomeProgramme";
import PublicFooter from "@/components/PublicFooter";
import MarqueeStrip from "@/components/MarqueeStrip";
import SubmitCtaSection from "@/components/SubmitCtaSection";

export const revalidate = 60;

export default async function Home() {
  const [speakers, day1, day2, day3, content, menuPages] = await Promise.all([
    getSpeakers().catch(() => []),
    getSessionsByDay(1).catch(() => []),
    getSessionsByDay(2).catch(() => []),
    getSessionsByDay(3).catch(() => []),
    getSiteContent().catch(() => ({})),
    getMenuPages().catch(() => []),
  ]);

  const schedule = { 1: day1, 2: day2, 3: day3 };

  return (
    <div className="font-sans antialiased text-ink bg-white">
      <PublicHeader menuPages={menuPages} />
      <HomeHero content={content.hero || {}} />
      <MarqueeStrip />
      <HomeAbout content={content.about || {}} />
      <HomeSpeakers speakers={speakers} />
      <HomeProgramme schedule={schedule} />
      <SubmitCtaSection />
      <PublicFooter content={content.footer || {}} menuPages={menuPages} />
    </div>
  );
}
