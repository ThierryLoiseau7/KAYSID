"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Yon erè te pase
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Gen yon pwoblèm teknik. Eseye ankò oswa retounen nan paj prensipal la.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Eseye Ankò
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Akèy
          </Link>
        </div>
      </div>
    </div>
  );
}
