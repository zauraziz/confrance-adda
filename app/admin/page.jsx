import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { FileText, UserCog, CalendarDays, Files, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session?.admin) redirect('/admin/login');

  let counts = { articles: 0, participants: 0, speakers: 0, sessions: 0, pages: 0 };
  try {
    const [a, p, sp, se, pg] = await Promise.all([
      sql`SELECT COUNT(*)::int AS c FROM articles`,
      sql`SELECT COUNT(*)::int AS c FROM participants`.catch(() => [{ c: 0 }]),
      sql`SELECT COUNT(*)::int AS c FROM speakers`,
      sql`SELECT COUNT(*)::int AS c FROM sessions`,
      sql`SELECT COUNT(*)::int AS c FROM pages`,
    ]);
    counts = { articles: a[0].c, participants: p[0].c, speakers: sp[0].c, sessions: se[0].c, pages: pg[0].c };
  } catch (e) { console.error('Dashboard:', e.message); }

  const stats = [
    { label: 'Məqalələr', value: counts.articles, icon: FileText },
    { label: 'İştirakçılar', value: counts.participants, icon: Users },
    { label: 'Spikerlər', value: counts.speakers, icon: UserCog },
    { label: 'Sessiyalar', value: counts.sessions, icon: CalendarDays },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-navy mb-2">Xoş gəldiniz</h1>
      <p className="text-ink/60 mb-10">ADDA Konfrans idarəetmə paneli</p>
      <div className="grid md:grid-cols-4 gap-5">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center mb-6">
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-4xl text-navy">{s.value}</div>
            <div className="mt-2 text-sm text-ink/55">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
