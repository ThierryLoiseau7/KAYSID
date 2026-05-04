"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Building2, PlusCircle, Heart, Settings, LogOut, Home, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard",               label: "Apèsi",           icon: LayoutDashboard },
  { href: "/dashboard/properties",    label: "Pwopriyete Mwen", icon: Building2       },
  { href: "/dashboard/new-listing",   label: "Nouvo Anons",     icon: PlusCircle      },
  { href: "/dashboard/favorites",     label: "Favori",          icon: Heart           },
  { href: "/dashboard/profile",       label: "Pwofil Mwen",     icon: UserCircle      },
  { href: "/dashboard/settings",      label: "Paramèt",         icon: Settings        },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState("Itilizatè");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserName(profile.full_name || user.email?.split("@")[0] || "Itilizatè");
          setUserRole(profile.role || "");
        } else {
          setUserName(user.email?.split("@")[0] || "Itilizatè");
        }
      });
    } catch {
      // Supabase pa konfigure
    }
  }, []);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/");
    router.refresh();
  }

  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden md:block">
            <div className="card p-3 sticky top-20">
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-caribbean-400 to-caribbean-700 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{userName}</p>
                  {userRole && (
                    <p className="text-xs text-slate-400 truncate capitalize">{userRole}</p>
                  )}
                </div>
              </div>

              <nav className="space-y-0.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-slate-100 mt-3 pt-3 space-y-0.5">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Sit Prensipal
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Dekonekte
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
