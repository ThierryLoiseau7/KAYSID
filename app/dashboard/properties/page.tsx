import Link from "next/link";
import { PlusCircle, Edit, Eye, Trash2, MoreVertical } from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { formatPrice, getPropertyTypeLabel, getCoverPhoto } from "@/lib/utils";
import Image from "next/image";

const MY_PROPERTIES = MOCK_PROPERTIES.filter((p) => p.owner_id === "u-001");

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

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pwopriyete Mwen</h1>
          <p className="text-slate-500 text-sm mt-1">
            {MY_PROPERTIES.length} anons total
          </p>
        </div>
        <Link href="/dashboard/new-listing" className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" />
          Nouvo Anons
        </Link>
      </div>

      {MY_PROPERTIES.length === 0 ? (
        <div className="card p-16 text-center">
          <PlusCircle className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">Pa gen anons ankò</h3>
          <Link href="/dashboard/new-listing" className="btn-primary text-sm mt-4">
            Poste Premye Anons Ou
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {MY_PROPERTIES.map((p) => {
            const cover = getCoverPhoto(p);
            const price = p.price_monthly ?? p.price_sale;
            return (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={cover}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {getPropertyTypeLabel(p.property_type)} ·{" "}
                        {p.location?.commune}
                        {p.location?.neighborhood && `, ${p.location.neighborhood}`}
                      </p>
                    </div>
                    <span className={`badge shrink-0 ${STATUS_COLORS[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    {price && (
                      <span className="text-sm font-bold text-caribbean-700">
                        {formatPrice(price, p.currency)}
                        {p.listing_type !== "sale" && (
                          <span className="text-slate-400 font-normal text-xs">/mwa</span>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {p.view_count} vizit
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/listings/${p.id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-caribbean-600 hover:bg-caribbean-50 transition-all"
                    title="Wè anons"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/dashboard/properties/${p.id}/edit`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    title="Edite"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Efase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
