"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, PlusCircle, LogIn, Home, User, LogOut } from "lucide-react";
import { COMMUNES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const CATEGORY_PILLS = [
  { href: "/listings", label: "Tout Anons", exact: true },
  { href: "/listings?listing_type=rent", label: "Pou Lwaye" },
  { href: "/listings?listing_type=sale", label: "Pou Vann" },
  { href: "/listings?property_type=chambrette", label: "Chanbrèt" },
  { href: "/listings?property_type=studio", label: "Studio" },
  { href: "/listings?property_type=appartement", label: "Apatman" },
  { href: "/listings?property_type=villa", label: "Villa" },
  { href: "/listings?property_type=te", label: "Terin" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [commune, setCommune] = useState("");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);

  function isPillActive(href: string): boolean {
    const [hrefPath, hrefQs] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (!hrefQs) {
      // "Tout Anons" — aktif sèlman si pa gen filtre
      const filtered = [...searchParams.entries()].filter(([k]) => k !== "page" && k !== "view");
      return filtered.length === 0;
    }
    const pillParams = new URLSearchParams(hrefQs);
    for (const [k, v] of pillParams) {
      if (searchParams.get(k) !== v) return false;
    }
    return true;
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (query) params.set("q", query);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 bg-caribbean-700 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 hidden sm:block">
              Kay<span className="text-caribbean-600">Sid</span>
            </span>
          </Link>

          {/* Search form — desktop only */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="flex w-full h-10 border border-slate-300 rounded-xl overflow-hidden hover:border-caribbean-400 focus-within:border-caribbean-500 focus-within:ring-2 focus-within:ring-caribbean-100 transition-all">
              <div className="flex flex-1 items-center">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Chèche kay, studio, villa..."
                  className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
                />
              </div>
              <div className="w-px bg-slate-200 self-stretch" />
              <div className="flex items-center min-w-[148px]">
                <MapPin className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="flex-1 pl-2 pr-2 py-2 text-sm text-slate-700 bg-white focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Tout Komin</option>
                  {COMMUNES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-5 bg-caribbean-700 hover:bg-caribbean-800 text-white text-sm font-semibold transition-colors"
              >
                Chèche
              </button>
            </div>
          </form>

          {/* Mobile search icon (links to listings) */}
          <Link
            href="/listings"
            className="md:hidden ml-auto p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Chèche"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Tableau de Bò
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Dekonekte"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Konekte
              </Link>
            )}
            <Link
              href="/dashboard/new-listing"
              className="flex items-center gap-1.5 px-4 py-2 bg-sunset-500 hover:bg-sunset-600 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:block">Poste Anons</span>
              <span className="sm:hidden">Poste</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category pills row ── */}
      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0.5 overflow-x-auto py-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORY_PILLS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap",
                  isPillActive(href)
                    ? "bg-caribbean-50 text-caribbean-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
