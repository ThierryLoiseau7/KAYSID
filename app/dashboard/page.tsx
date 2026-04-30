export const dynamic = "force-dynamic";

import Link from "next/link";
import { Eye, MessageCircle, Building2, TrendingUp, PlusCircle, ChevronRight, BadgeCheck } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import { getUserProperties } from "@/lib/supabase/queries";

const STATUS_COLORS: Record<string, string> = {
  active:         "bg-green-100 text-green-700",
  rented:         "bg-blue-100 text-blue-700",
  sold:           "bg-slate-100 text-slate-700",
  pending_review: "bg-yellow-100 text-yellow-700",
  suspended:      "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  active:         "Aktif",
  rented:         "Lwaye",
  sold:           "Vann",
  pending_review: "Ap Revize",
  suspended:      "Sipann",
};

export default async function DashboardPage() {
  let user = null;
  let profile = null;
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
    if (user) {
      const { data } = await supabase
        .from("profiles").select("full_name").eq("id", user.id).single();
      profile = data;
    }
  } catch {
    // Supabase pa konfigure
  }

  const MY_PROPERTIES = user ? await getUserProperties(user.id) : [];
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Itilizatè";

  const STATS = [
    {
      label: "Anons Aktif",
      value: MY_PROPERTIES.filter((p) => p.status === "active").length,
      icon: Building2,
      color: "bg-caribbean-50 text-caribbean-700",
      trend: "Anons ou yo",
    },
    {
      label: "Total Vizit",
      value: MY_PROPERTIES.reduce((s, p) => s + p.view_count, 0).toLocaleString(),
      icon: Eye,
      color: "bg-blue-50 text-blue-700",
      trend: "Kumulatif",
    },
    {
      label: "Kontakt Resevwa",
      value: MY_PROPERTIES.reduce((s, p) => s + p.contact_count, 0),
      icon: MessageCircle,
      color: "bg-green-50 text-green-700",
      trend: "Kumulatif",
    },
    {
      label: "Ti Pousantaj Kontak",
      value: `${Math.round(
        (MY_PROPERTIES.reduce((s, p) => s + p.contact_count, 0) /
          Math.max(MY_PROPERTIES.reduce((s, p) => s + p.view_count, 0), 1)) *
          100
      )}%`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-700",
      trend: "Bon rezilta",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de Bò</h1>
          <p className="text-slate-500 text-sm mt-0.5">Bonjou, {userName} 👋</p>
        </div>
        <Link href="/dashboard/new-listing" className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" />
          Nouvo Anons
        </Link>
      </div>

      {/* Verification banner */}
      <div className="bg-gradient-to-r from-caribbean-700 to-caribbean-500 rounded-2xl p-5 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-8 h-8 text-caribbean-200 shrink-0" />
          <div>
            <p className="font-semibold">Verifye Kont Ou!</p>
            <p className="text-caribbean-100 text-sm">
              Télécharge ID ou pou resevwa badge &quot;Ajan Verifye&quot; — lokatè fè plis konfyans sou anons verifye.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className="shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-semibold transition-all"
        >
          Verifye →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{trend}</p>
          </div>
        ))}
      </div>

      {/* Properties table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-lg">Pwopriyete Ou</h2>
          <Link
            href="/dashboard/properties"
            className="flex items-center gap-1 text-sm text-caribbean-600 font-semibold hover:text-caribbean-800 transition-colors"
          >
            Wè tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="card overflow-hidden hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                  Pwopriyete
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                  Statik
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                  Vizit
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                  Kontakt
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                  Aksyon
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MY_PROPERTIES.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900 text-sm line-clamp-1">{p.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {p.location?.commune} · {p.location?.neighborhood}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${STATUS_COLORS[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-medium text-slate-700">{p.view_count}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-medium text-slate-700">{p.contact_count}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/listings/${p.id}`}
                        className="text-xs text-caribbean-600 hover:text-caribbean-800 font-medium transition-colors"
                      >
                        Wè
                      </Link>
                      <Link
                        href={`/dashboard/properties/${p.id}/edit`}
                        className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
                      >
                        Edite
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-4 sm:hidden">
          {MY_PROPERTIES.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Poste Anons",
            desc: "Ajoute yon nouvo pwopriyete sou sit la",
            href: "/dashboard/new-listing",
            color: "bg-caribbean-700",
            icon: PlusCircle,
          },
          {
            title: "Wè Favori",
            desc: "Kay ou sove pou tounen gade",
            href: "/dashboard/favorites",
            color: "bg-sunset-600",
            icon: Eye,
          },
          {
            title: "Jwenn Ajan Premium",
            desc: "Mete anons ou anlè pou plis vizibilite",
            href: "/dashboard/premium",
            color: "bg-purple-700",
            icon: TrendingUp,
          },
        ].map(({ title, desc, href, color, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${color} text-white rounded-2xl p-5 hover:opacity-90 transition-opacity group`}
          >
            <Icon className="w-6 h-6 mb-3 opacity-80" />
            <p className="font-bold">{title}</p>
            <p className="text-sm opacity-75 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
