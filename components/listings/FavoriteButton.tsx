"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/app/actions/listings";

interface Props {
  propertyId: string;
  initialFavorite?: boolean;
  variant?: "card-grid" | "card-horizontal";
}

export default function FavoriteButton({ propertyId, initialFavorite = false, variant = "card-grid" }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    setIsFavorite((prev) => !prev); // optimistic
    const result = await toggleFavorite(propertyId);
    setIsFavorite(result.isFavorite);
    setLoading(false);
  }

  if (variant === "card-horizontal") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all border",
          isFavorite
            ? "bg-red-50 text-red-500 border-red-200"
            : "bg-white text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-200"
        )}
        aria-label={isFavorite ? "Retire nan favori" : "Ajoute nan favori"}
      >
        <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
        isFavorite ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-500"
      )}
      aria-label={isFavorite ? "Retire nan favori" : "Ajoute nan favori"}
    >
      <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
    </button>
  );
}
