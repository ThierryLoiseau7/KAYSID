import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";

export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="card p-4 space-y-3 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </aside>

        {/* Listings skeleton */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-100 rounded w-32 animate-pulse" />
            <div className="h-8 bg-slate-100 rounded-xl w-24 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} horizontal />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
