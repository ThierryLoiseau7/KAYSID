"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { translateListing } from "@/app/actions/ai";

type Lang = "ht" | "fr" | "en";

const LANG_LABELS: Record<Lang, string> = { ht: "Kreyòl", fr: "Français", en: "English" };

interface Props {
  title: string;
  description: string;
  descriptionOnly?: boolean;
}

export default function DescriptionTranslator({ title, description, descriptionOnly = false }: Props) {
  const [lang, setLang] = useState<Lang>("ht");
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<Partial<Record<Lang, { title: string; description: string }>>>({
    ht: { title, description },
  });

  async function switchLang(target: Lang) {
    if (target === lang) return;
    setLang(target);
    if (translations[target]) return; // deja tradui

    setLoading(true);
    const result = await translateListing(title, description, target as "fr" | "en");
    setLoading(false);

    if (result.title && result.description) {
      setTranslations((prev) => ({
        ...prev,
        [target]: { title: result.title!, description: result.description! },
      }));
    }
  }

  const current = translations[lang];

  return (
    <div>
      {/* Language toggle */}
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-1">
          {(["ht", "fr", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                lang === l
                  ? "bg-caribbean-700 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
        {loading && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3 h-3 border-2 border-slate-300 border-t-caribbean-600 rounded-full animate-spin" />
            Kap tradui...
          </span>
        )}
      </div>

      {/* Title */}
      {!descriptionOnly && (
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
          {loading && lang !== "ht" ? title : (current?.title ?? title)}
        </h1>
      )}

      {/* Description */}
      {descriptionOnly && description && (
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {loading && lang !== "ht" ? description : (current?.description ?? description)}
        </p>
      )}
    </div>
  );
}
