"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, UserCog, CalendarDays, Files, Settings,
  LogOut, Anchor, Eye, Layers, ListTree, MoveHorizontal, Handshake,
  Palette, FileEdit, Users
} from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Məqalələr", icon: FileText },
  { href: "/admin/participants", label: "İştirakçılar", icon: Users },
  { href: "/admin/speakers", label: "Spikerlər", icon: UserCog },
  { href: "/admin/sections", label: "Bölmələr", icon: Layers },
  { href: "/admin/schedule", label: "Cədvəl", icon: CalendarDays },
  { href: "/admin/pages", label: "Səhifələr", icon: Files },
  { href: "/admin/menu", label: "Menyu", icon: ListTree },
  { href: "/admin/marquee", label: "Hərəkətli strip", icon: MoveHorizontal },
  { href: "/admin/partners", label: "Tərəfdaşlar", icon: Handshake },
  { href: "/admin/content", label: "Sayt mətnləri", icon: FileEdit },
  { href: "/admin/branding", label: "Brendinq", icon: Palette },
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
      <aside className="w-72 bg-navy-dark text-white min-h-screen flex flex-col shrink-0">
        <div className="px-6 py-7 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center ring-1 ring-gold/40">
            <Anchor className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold">ADDA</div>
            <div className="font-display text-base">İdarəetmə</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                    className={`flex items-center gap-3 px-6 py-2.5 text-[13px] relative transition-colors ${
                      active ? "text-white bg-white/[0.06]" : "text-white/55 hover:text-white hover:bg-white/[0.03]"
                    }`}>
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gold rounded-r" />}
                <Icon className="w-4 h-4 shrink-0" /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="text-xs text-white/50">
            Daxil olunmuş: <strong className="text-white/80">{admin?.full_name || admin?.username}</strong>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-white/60 hover:text-gold transition-colors">
            <Eye className="w-4 h-4" /> Saytı gör
          </Link>
          <button onClick={logout}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Çıxış
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
