import { Shield, Clock, CheckCircle, XCircle, Flag, Users, Eye } from "lucide-react";
import { getAdminProperties } from "@/lib/supabase/queries";
import type { Property } from "@/types";
import { approveProperty, rejectProperty } from "@/app/actions/properties";
import { formatPrice, getPropertyTypeLabel, getCoverPhoto, timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function AdminPage() {
  let PENDING: Property[] = [];
  let ACTIVE: Property[] = [];
  try {
    [PENDING, ACTIVE] = await Promise.all([
      getAdminProperties("pending_review"),
      getAdminProperties("active"),
    ]);
  } catch {
    // Supabase pa konfigure — montre panel vid
  }

  const ADMIN_STATS = [
    { label: "Ap Tann Revizyon", value: PENDING.length, icon: Clock,       color: "bg-yellow-900/50 text-yellow-400 border-yellow-800" },
    { label: "Anons Aktif",      value: ACTIVE.length,  icon: CheckCircle, color: "bg-green-900/50 text-green-400 border-green-800"    },
    { label: "Itilizatè Total",  value: "—",            icon: Users,       color: "bg-blue-900/50 text-blue-400 border-blue-800"       },
    { label: "Rapò Ouvri",       value: 0,              icon: Flag,        color: "bg-red-900/50 text-red-400 border-red-800"          },
  ];
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-red-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Panel Administrasyon</h1>
          <p className="text-slate-400 text-sm">Jere anons, itilizatè ak rapò</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`border rounded-2xl p-5 ${color}`}>
            <Icon className="w-6 h-6 mb-3 opacity-80" />
            <p className="text-3xl font-extrabold text-white">{value}</p>
            <p className="text-xs opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending review queue */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          Anons Ap Tann Apwobasyon
          {PENDING.length > 0 && (
            <span className="badge bg-yellow-500 text-white">{PENDING.length}</span>
          )}
        </h2>

        {PENDING.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Tout anons yo revize. Bon travay!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {PENDING.map((p) => (
              <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-700 shrink-0">
                  <Image
                    src={getCoverPhoto(p)}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{p.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {getPropertyTypeLabel(p.property_type)} · {p.location?.commune} ·{" "}
                    {p.owner?.full_name} · {timeAgo(p.created_at)} de sa
                  </p>
                  {p.price_monthly && (
                    <p className="text-caribbean-400 text-xs font-semibold mt-1">
                      {formatPrice(p.price_monthly, p.currency)}/mwa
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/listings/${p.id}`}
                    className="w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all"
                    title="Wè anons"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <form action={approveProperty.bind(null, p.id)}>
                    <button type="submit" className="w-9 h-9 bg-green-700 hover:bg-green-600 rounded-xl flex items-center justify-center text-white transition-all" title="Apwouve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </form>
                  <form action={rejectProperty.bind(null, p.id)}>
                    <button type="submit" className="w-9 h-9 bg-red-800 hover:bg-red-700 rounded-xl flex items-center justify-center text-white transition-all" title="Rejte">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active listings table */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Dènye Anons Aktif</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Anons</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Ajan</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Vizit</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Aksyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {ACTIVE.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{p.location?.commune}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-300 text-sm">{p.owner?.full_name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-slate-300 text-sm">{p.view_count}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/listings/${p.id}`}
                        className="text-xs text-caribbean-400 hover:text-caribbean-300 font-medium transition-colors"
                      >
                        Wè
                      </Link>
                      <form action={rejectProperty.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
                          Sipann
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
