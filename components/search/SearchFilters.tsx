"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { COMMUNES, LOCATIONS, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType } from "@/types";

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset page quand on filtre
    next.delete("page");
    router.push(`/listings?${next.toString()}`);
  }

  function clearAll() {
    router.push("/listings");
  }

  const currentCommune = params.get("commune") ?? "";
  const neighborhoods = LOCATIONS.filter(
    (l) => l.commune === currentCommune && l.neighborhood
  ).map((l) => l.neighborhood as string);

  const hasFilters = [...params.entries()].some(([k]) => k !== "page");

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="card p-5 sticky top-20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-caribbean-600" />
            Filtre
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Efase tout
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Tip anonse */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Tip Anonse
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: "", label: "Tout" },
                { value: "rent", label: "Lwaye" },
                { value: "sale", label: "Vann" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update("listing_type", value)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (params.get("listing_type") ?? "") === value
                      ? "bg-caribbean-700 text-white border-caribbean-700"
                      : "bg-white text-slate-600 border-slate-200 hover:border-caribbean-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Komin */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Komin
            </label>
            <select
              value={currentCommune}
              onChange={(e) => {
                update("commune", e.target.value);
                update("neighborhood", "");
              }}
              className="input-field text-sm"
            >
              <option value="">Tout Komin</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Katye (si komin chwazi) */}
          {neighborhoods.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Katye
              </label>
              <select
                value={params.get("neighborhood") ?? ""}
                onChange={(e) => update("neighborhood", e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Tout Katye</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tip Kay */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Tip Kay
            </label>
            <select
              value={params.get("property_type") ?? ""}
              onChange={(e) => update("property_type", e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Tout Tip</option>
              {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
                ([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Chanm */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Chanm Minimòm
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {["", "1", "2", "3"].map((v) => (
                <button
                  key={v}
                  onClick={() => update("bedrooms", v)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (params.get("bedrooms") ?? "") === v
                      ? "bg-caribbean-700 text-white border-caribbean-700"
                      : "bg-white text-slate-600 border-slate-200 hover:border-caribbean-400"
                  }`}
                >
                  {v === "" ? "Tout" : `${v}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Bidjè */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Bidjè (USD/mwa)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={params.get("min_price") ?? ""}
                onChange={(e) => update("min_price", e.target.value)}
                className="input-field text-sm w-full"
              />
              <input
                type="number"
                placeholder="Max"
                value={params.get("max_price") ?? ""}
                onChange={(e) => update("max_price", e.target.value)}
                className="input-field text-sm w-full"
              />
            </div>
          </div>

          {/* Mèble */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() =>
                update(
                  "furnished",
                  params.get("furnished") === "true" ? "" : "true"
                )
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                params.get("furnished") === "true"
                  ? "bg-caribbean-600"
                  : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  params.get("furnished") === "true" ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className="text-sm text-slate-700 font-medium">Mèble sèlman</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
