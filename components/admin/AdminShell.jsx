"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, UserCog, CalendarDays, FileEdit, Settings, LogOut, Anchor, Eye, Files } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Məqalələr", icon: FileText },
  { href: "/admin/speakers", label: "Spikerlər", icon: UserCog },
  { href: "/admin/schedule", label: "Cədvəl", icon: CalendarDays },
  { href: "/admin/pages", label: "Səhifələr", icon: Files },
  { href: "/admin/content", label: "Sayt mətnləri", icon: FileEdit },
  { href: "/admin/settings", label: "Tənzimləmələr", icon: Settings },
];

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex">
      <aside className="w-72 bg-navy-dark text-white min-h-screen flex flex-col">
        <div className="px-6 py-7 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center ring-1 ring-gold/40">
            <Anchor className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold">ADDA</div>
            <div className="font-display text-base">İdarəetmə</div>
          </div>
        </div>
        <nav className="flex-1 py-6">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                    className={`flex items-center gap-3 px-6 py-3 text-sm relative ${
                      active ? "text-white bg-white/[0.04]" : "text-white/60 hover:text-white"
                    }`}>
                {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-gold rounded-r" />}
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="text-xs text-white/50">Daxil olunmuş: <strong className="text-white/80">{admin?.full_name || admin?.username}</strong></div>
          <Link href="/" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold">
            <Eye className="w-4 h-4" /> Saytı gör
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
            <LogOut className="w-4 h-4" /> Çıxış
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-10">{children}</main>
    </div>
  );
}
