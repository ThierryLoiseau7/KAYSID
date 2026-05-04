import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-caribbean-100 leading-none mb-4 select-none">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Paj sa a pa egziste
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Anons lan ka efase, oswa ou te tape yon lyen mal. Pa enkyete ou!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Retounen Akèy
          </Link>
          <Link href="/listings" className="btn-secondary">
            <Search className="w-4 h-4" />
            Chèche Anons
          </Link>
        </div>
      </div>
    </div>
  );
}
