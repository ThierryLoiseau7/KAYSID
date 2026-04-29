"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { COMMUNES, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType } from "@/types";

export default function HeroSearch() {
  const router = useRouter();
  const [commune, setCommune] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const budgetOptions = [
    { label: "Tout Bidjè",    value: "" },
    { label: "Anba $200",     value: "0-200" },
    { label: "$200 – $500",   value: "200-500" },
    { label: "$500 – $1,000", value: "500-1000" },
    { label: "Anlè $1,000",   value: "1000-99999" },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (type) params.set("property_type", type);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("min_price", min);
      if (max) params.set("max_price", max);
    }
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
        {/* Komin */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-caribbean-500 pointer-events-none" />
          <select
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            className="w-full pl-10 pr-3 py-3.5 rounded-xl bg-slate-50 border-0 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-caribbean-500 appearance-none cursor-pointer"
          >
            <option value="">Tout Komin yo</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px bg-slate-200 hidden sm:block self-stretch my-1" />

        {/* Tip Kay */}
        <div className="flex-1 relative">
          <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-caribbean-500 pointer-events-none" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full pl-10 pr-3 py-3.5 rounded-xl bg-slate-50 border-0 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-caribbean-500 appearance-none cursor-pointer"
          >
            <option value="">Tout Tip Kay</option>
            {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="w-px bg-slate-200 hidden sm:block self-stretch my-1" />

        {/* Bidjè */}
        <div className="flex-1 relative">
          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-caribbean-500 pointer-events-none" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full pl-10 pr-3 py-3.5 rounded-xl bg-slate-50 border-0 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-caribbean-500 appearance-none cursor-pointer"
          >
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-7 py-3.5 bg-caribbean-700 hover:bg-caribbean-800 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap text-sm"
        >
          <Search className="w-4 h-4" />
          Chèche
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {[
          { label: "Studio Okay", params: "commune=Okay&property_type=studio" },
          { label: "Bò Lanmè Port-Salut", params: "commune=Port-Salut" },
          { label: "Jakmèl Lwaye", params: "commune=Jakmèl&listing_type=rent" },
          { label: "Terin pou Vann", params: "property_type=te&listing_type=sale" },
          { label: "Villa Premium", params: "property_type=villa" },
        ].map(({ label, params }) => (
          <button
            key={label}
            type="button"
            onClick={() => router.push(`/listings?${params}`)}
            className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-xs font-medium rounded-full transition-all"
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}
