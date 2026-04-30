export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchFilters from "@/components/search/SearchFilters";
import ListingsContent from "@/components/search/ListingsContent";
import { getProperties } from "@/lib/supabase/queries";
import type { PropertyType, ListingType } from "@/types";

export const metadata: Metadata = {
  title: "Chèche Kay",
  description: "Chèche studio, apatman, villa, terin nan Okay, Jakmèl, Port-Salut ak tout Sid Ayiti.",
};

interface ListingsPageProps {
  searchParams: Promise<{
    commune?: string;
    neighborhood?: string;
    property_type?: string;
    listing_type?: string;
    min_price?: string;
    max_price?: string;
    bedrooms?: string;
    furnished?: string;
    page?: string;
    view?: string;
    q?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;

  const filters = {
    commune: params.commune,
    neighborhood: params.neighborhood,
    property_type: params.property_type as PropertyType | undefined,
    listing_type: params.listing_type as ListingType | undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    q: params.q,
  };

  const page = Number(params.page ?? 1);
  const perPage = 15;
  const { data: paginated, count: total } = await getProperties(filters, page, perPage);
  const totalPages = Math.ceil((total ?? 0) / perPage);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const view = (params.view ?? "list") as "list" | "grid";

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {params.commune ? `Kay nan ${params.commune}` : "Tout Anons"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {total === 0 ? "Pa gen rezilta" : `${total} anons`}
              {activeFilterCount > 0 && (
                <>
                  {" · "}
                  <Link href="/listings" className="text-caribbean-600 hover:underline">
                    {activeFilterCount} filtre — efase
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          {/* Sidebar */}
          <Suspense fallback={null}>
            <div className="hidden lg:block">
              <SearchFilters />
            </div>
          </Suspense>

          {/* Content */}
          <Suspense fallback={null}>
            <ListingsContent
              paginated={paginated}
              total={total}
              page={page}
              totalPages={totalPages}
              view={view}
              params={params}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
