export const dynamic = "force-dynamic";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";

const PROPERTY_SELECT = `
  *,
  location:locations(*),
  photos:property_photos(id, url, is_cover, display_order),
  owner:profiles!owner_id(id, full_name, avatar_url, role, is_verified, whatsapp)
`;

export default async function FavoritesPage() {
  let favorites: Property[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select(`property:properties(${PROPERTY_SELECT})`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      favorites = (data?.map((f) => f.property).filter(Boolean) ?? []) as Property[];
    }
  } catch {
    // Supabase pa konfigure — paj vid
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Favori Ou</h1>
        <p className="text-slate-500 text-sm mt-1">
          {favorites.length} pwopriyete ou sove
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">Pa gen favori ankò</h3>
          <p className="text-slate-400 text-sm mb-6">
            Klike sou kè a sou yon pwopriyete pou sove li isit.
          </p>
          <Link href="/listings" className="btn-primary text-sm">
            <Search className="w-4 h-4" />
            Chèche Kay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {favorites.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
