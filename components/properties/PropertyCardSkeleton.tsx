export default function PropertyCardSkeleton({ horizontal = false }: { horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex animate-pulse">
        <div className="w-40 sm:w-52 bg-slate-100 shrink-0" />
        <div className="flex-1 p-3.5 space-y-3">
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="flex gap-2 mt-auto pt-2">
            <div className="h-5 bg-slate-100 rounded w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-3.5 space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-5 bg-slate-100 rounded" />
          ))}
        </div>
        <div className="border-t border-slate-100 pt-2.5 flex justify-between">
          <div className="h-5 bg-slate-100 rounded w-24" />
          <div className="h-3 bg-slate-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
