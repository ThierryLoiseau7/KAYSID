"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search, MapPin, DoorOpen, Building, Layers, Home,
  Trees, Landmark, Castle, BedDouble, ChevronRight,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { COMMUNES } from "@/lib/constants";
import type { Property } from "@/types";

const CATEGORIES = [
  { label: "Chanbrèt",  icon: DoorOpen,  href: "/listings?property_type=chambrette" },
  { label: "Studio",    icon: Building,  href: "/listings?property_type=studio"      },
  { label: "Apatman",   icon: Layers,    href: "/listings?property_type=appartement" },
  { label: "2 Chanm",   icon: BedDouble, href: "/listings?property_type=kay_2_chanm" },
  { label: "3 Chanm+",  icon: Home,      href: "/listings?property_type=kay_3_chanm" },
  { label: "Villa",     icon: Castle,    href: "/listings?property_type=villa"        },
  { label: "Terin",     icon: Landmark,  href: "/listings?property_type=te"           },
  { label: "Tout Tip",  icon: Trees,     href: "/listings"                            },
];

const COMMUNES_FEATURED = [
  { name: "Okay",       slug: "okay",       tagline: "Kapital Sid",     image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80" },
  { name: "Jakmèl",     slug: "jakmel",     tagline: "Vil Powèt",       image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { name: "Port-Salut", slug: "port-salut", tagline: "Paradi Plaj",     image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { name: "Jeremi",     slug: "jeremi",     tagline: "Gran Anz",        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },
];

interface Props {
  recentProperties: Property[];
}

export default function HomeClient({ recentProperties }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [commune, setCommune] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (query) params.set("q", query);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Search Banner ── */}
      <div className="bg-caribbean-800 py-6 px-4">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 bg-white rounded-xl overflow-hidden border border-transparent focus-within:border-caribbean-400 focus-within:ring-2 focus-within:ring-caribbean-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-3.5 self-center shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kay, studio, villa, terin..."
                className="flex-1 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
              />
              <div className="hidden sm:flex items-center border-l border-slate-200">
                <MapPin className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="pl-2 pr-8 py-3 text-sm text-slate-700 bg-white focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Tout Komin</option>
                  {COMMUNES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-sunset-500 hover:bg-sunset-600 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow"
            >
              <Search className="w-4 h-4" />
              Chèche
            </button>
          </div>

          {/* Popular searches */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-3">
            <span className="text-white/40 text-xs font-medium shrink-0 uppercase tracking-wide">Popilè:</span>
            {[
              { label: "Studio Okay",         params: "commune=Okay&property_type=studio" },
              { label: "Bò Lanmè Port-Salut", params: "commune=Port-Salut" },
              { label: "Jakmèl Lwaye",        params: "commune=Jakmèl&listing_type=rent" },
              { label: "Terin pou Vann",      params: "property_type=te&listing_type=sale" },
            ].map(({ label, params }) => (
              <button
                key={label}
                type="button"
                onClick={() => router.push(`/listings?${params}`)}
                className="text-white/75 hover:text-white text-xs font-medium transition-colors underline underline-offset-2 decoration-white/30 hover:decoration-white/70"
              >
                {label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ── Categories Strip ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-0 no-scrollbar -mb-px">
            {CATEGORIES.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-5 py-3.5 text-sm font-medium text-slate-600 hover:text-caribbean-700 border-b-2 border-transparent hover:border-caribbean-600 whitespace-nowrap transition-colors shrink-0"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Type tabs ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 mb-4">
        <div className="flex items-center gap-1 border-b border-slate-200">
          {[
            { label: "Tout Anons", href: "/listings" },
            { label: "Pou Lwaye",  href: "/listings?listing_type=rent" },
            { label: "Pou Vann",   href: "/listings?listing_type=sale" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-caribbean-700 border-b-2 border-transparent hover:border-caribbean-600 -mb-px transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent Listings ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Dènye Anons</h2>
          <Link
            href="/listings"
            className="flex items-center gap-1 text-xs font-semibold text-caribbean-700 hover:text-caribbean-900 transition-colors"
          >
            Wè tout
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">Pa gen anons pou kounye a. Tounen pita!</p>
          </div>
        )}
      </section>

      {/* ── Communes ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Eksplore pa Komin
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMMUNES_FEATURED.map(({ name, slug, tagline, image }) => (
            <Link
              key={slug}
              href={`/communes/${slug}`}
              className="relative overflow-hidden rounded-xl aspect-[4/3] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="font-bold text-white text-sm leading-tight">{name}</p>
                <p className="text-white/70 text-xs">{tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
