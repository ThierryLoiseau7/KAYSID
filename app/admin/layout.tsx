import Link from "next/link";
import { Shield, LayoutDashboard, Building2, Users, Flag, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Apèsi", icon: LayoutDashboard },
  // TODO: kreye paj sa yo
  // { href: "/admin/listings", label: "Anons",     icon: Building2 },
  // { href: "/admin/users",    label: "Itilizatè", icon: Users     },
  // { href: "/admin/reports",  label: "Rapò",      icon: Flag      },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <aside className="w-52 shrink-0">
            <div className="bg-slate-800 rounded-2xl p-3">
              <div className="flex items-center gap-2 px-3 py-3 mb-2 border-b border-slate-700">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Admin</p>
                  <p className="text-slate-400 text-xs">KaySid Panel</p>
                </div>
              </div>
              <nav className="space-y-0.5">
                {NAV.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-slate-700 mt-3 pt-3">
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700 transition-all">
                  <LogOut className="w-4 h-4" />
                  Kite Admin
                </Link>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
