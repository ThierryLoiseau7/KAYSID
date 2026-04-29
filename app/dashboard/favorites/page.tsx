"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

// Simulate saved favorites (first 3 properties)
const INITIAL_FAVORITES = MOCK_PROPERTIES.slice(0, 3).map((p) => p.id);

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const savedProperties = MOCK_PROPERTIES.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Favori Ou</h1>
        <p className="text-slate-500 text-sm mt-1">
          {savedProperties.length} pwopriyete ou sove
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">Pa gen favori ankò</h3>
          <p className="text-slate-400 text-sm mb-6">
            Klike sou kè a sou yon pwopriyete pou sove li la.
          </p>
          <Link href="/listings" className="btn-primary text-sm">
            <Search className="w-4 h-4" />
            Chèche Kay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
