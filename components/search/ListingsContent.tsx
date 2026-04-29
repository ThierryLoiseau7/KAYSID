"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property } from "@/types";

const SORT_OPTIONS = [
  { value: "newest",     label: "Pi Resan"     },
  { value: "price_asc",  label: "Pri Kwa ↑"    },
  { value: "price_desc", label: "Pri Desann ↓" },
  { value: "popular",    label: "Pi Popilè"    },
];

interface Props {
  paginated: Property[];
  total: number;
  page: number;
  totalPages: number;
  view: "list" | "grid";
  params: Record<string, string | undefined>;
}

export default function ListingsContent({
  paginated, total, page, totalPages, view, params,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildPageUrl(p: number) {
    const q = new URLSearchParams(searchParams.toString());
    q.set("page", String(p));
    return `/listings?${q.toString()}`;
  }

  function setView(v: "list" | "grid") {
    const q = new URLSearchParams(searchParams.toString());
    q.set("view", v);
    router.replace(`/listings?${q.toString()}`);
  }

  const activeFilterCount = Object.values(params).filter(Boolean).length;

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {/* Mobile filter button */}
        <button className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-caribbean-400 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filtre
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-caribbean-600 text-white rounded-full text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort */}
          <select
            onChange={(e) => {
              const q = new URLSearchParams(searchParams.toString());
              q.set("sort", e.target.value);
              router.push(`/listings?${q.toString()}`);
            }}
            className="text-sm py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-caribbean-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-caribbean-700 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              aria-label="Lis"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-caribbean-700 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              aria-label="Griy"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {paginated.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-slate-200">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-2">Pa gen rezilta</h3>
          <p className="text-slate-400 text-sm mb-5">
            Eseye chanje filtre yo oswa chèche nan yon lòt komin.
          </p>
          <Link href="/listings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-caribbean-700 hover:bg-caribbean-800 text-white font-semibold text-sm rounded-xl transition-colors">
            Wè tout anons
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginated.map((property) => (
            <PropertyCard key={property.id} property={property} horizontal />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-caribbean-400 transition-colors">
              ← Anvan
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                p === page
                  ? "bg-caribbean-700 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-caribbean-400"
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-caribbean-400 transition-colors">
              Swivan →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
