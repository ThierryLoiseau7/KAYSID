import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronLeft, ExternalLink } from "lucide-react";
import { getCommuneBySlug, COMMUNE_SLUGS } from "@/lib/communes-data";
import type { CommunePlace } from "@/lib/communes-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMMUNE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const commune = getCommuneBySlug(slug);
  if (!commune) return { title: "Pa Jwenn" };
  return {
    title: `${commune.name} — Istwa, Touris & Enfòmasyon`,
    description: commune.tagline,
  };
}

const PLACE_TYPE_LABELS: Record<CommunePlace["type"], string> = {
  plaj:      "Plaj",
  mòn:       "Mòn / Wotè",
  patrimwan: "Patrimwan",
  restoran:  "Gastronomik",
  mache:     "Mache",
  natirèl:   "Nati",
};

const PLACE_TYPE_STYLE: Record<CommunePlace["type"], { border: string; text: string }> = {
  plaj:      { border: "border-l-blue-500",   text: "text-blue-600"   },
  mòn:       { border: "border-l-green-600",  text: "text-green-700"  },
  patrimwan: { border: "border-l-amber-500",  text: "text-amber-600"  },
  restoran:  { border: "border-l-orange-500", text: "text-orange-600" },
  mache:     { border: "border-l-purple-500", text: "text-purple-600" },
  natirèl:   { border: "border-l-teal-500",   text: "text-teal-600"   },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-slate-900 border-l-4 border-caribbean-500 pl-3 mb-6 leading-snug uppercase tracking-wide">
      {children}
    </h2>
  );
}

export default async function CommunePage({ params }: Props) {
  const { slug } = await params;
  const commune = getCommuneBySlug(slug);
  if (!commune) notFound();

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero ── */}
      <div className="relative h-72 sm:h-[420px] overflow-hidden">
        <Image
          src={commune.coverImage}
          alt={commune.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retounen Akèy
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 sm:pb-10">
          <p className="text-caribbean-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            Depatman {commune.department}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-3">
            {commune.name}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg">{commune.tagline}</p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="flex divide-x divide-slate-200 py-5">
            {[
              { label: "Popilasyon",  value: commune.population },
              { label: "Sipèfisi",    value: commune.superficie },
              { label: "Altitid",     value: commune.altitude   },
              { label: "Depatman",    value: commune.department },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1 px-4 first:pl-0 last:pr-0">
                <p className="text-base sm:text-xl font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-[11px] text-slate-400 mt-1.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── CTA Anons ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-caribbean-700 px-6 py-5">
          <div>
            <p className="text-white font-bold text-base">Chèche Kay nan {commune.name}</p>
            <p className="text-caribbean-300 text-sm mt-0.5">
              Lwaye · Vann · Studio · Villa
            </p>
          </div>
          <Link
            href={`/listings?commune=${encodeURIComponent(commune.name.split(" ")[0])}`}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-caribbean-800 font-bold text-sm hover:bg-caribbean-50 transition-colors"
          >
            Wè Anons
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Istwa ── */}
        <section>
          <SectionTitle>Istwa {commune.name}</SectionTitle>
          <div className="space-y-5">
            {commune.history.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-slate-800 leading-relaxed text-base sm:text-lg font-medium"
                    : "text-slate-500 leading-relaxed text-sm sm:text-base"
                }
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── Kote pou Vizite ── */}
        <section>
          <SectionTitle>Kote pou Vizite</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commune.places.map((place) => {
              const s = PLACE_TYPE_STYLE[place.type];
              return (
                <div
                  key={place.name}
                  className={`bg-white border border-slate-200 border-l-4 ${s.border} p-5 hover:shadow-sm transition-shadow`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${s.text}`}>
                    {PLACE_TYPE_LABELS[place.type]}
                  </p>
                  <h3 className="font-bold text-slate-900 mb-2">{place.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{place.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Ofisyèl yo ── */}
        <section>
          <SectionTitle>Ofisyèl yo</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border border-slate-200 overflow-hidden">

            {/* Mayor */}
            <div className="bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-caribbean-600 mb-4">Mayor Aktiyèl</p>
              <p className="font-bold text-slate-900 text-sm">{commune.currentMayor.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{commune.currentMayor.period}</p>
              {commune.currentMayor.party && (
                <p className="text-xs text-slate-400">{commune.currentMayor.party}</p>
              )}
              {commune.formerMayors.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Ansyen Mayor</p>
                  <div className="space-y-2.5">
                    {commune.formerMayors.map((m) => (
                      <div key={m.name} className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-medium text-slate-700">{m.name}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">{m.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Depite */}
            <div className="bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-caribbean-600 mb-4">Depite Aktiyèl</p>
              <p className="font-bold text-slate-900 text-sm">{commune.currentDeputy.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{commune.currentDeputy.title}</p>
              <p className="text-xs text-slate-400">{commune.currentDeputy.period}</p>
              {commune.formerDeputies.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Ansyen Depite</p>
                  <div className="space-y-2.5">
                    {commune.formerDeputies.map((d) => (
                      <div key={d.name} className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-medium text-slate-700">{d.name}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">{d.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Senatè */}
            {commune.senator ? (
              <div className="bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-caribbean-600 mb-4">Senatè</p>
                <p className="font-bold text-slate-900 text-sm">{commune.senator.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{commune.senator.title}</p>
                <p className="text-xs text-slate-400">{commune.senator.period}</p>
              </div>
            ) : (
              <div className="bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Senatè</p>
                <p className="text-xs text-slate-400 italic">Enfòmasyon pa disponib</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Ekonomi ── */}
        <section>
          <SectionTitle>Ekonomi</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {commune.economy.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-100">
                <span className="text-caribbean-500 font-bold text-sm shrink-0 mt-px leading-none">—</span>
                <p className="text-sm text-slate-600 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Gastronomik + Festival ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <section>
            <SectionTitle>Gastronomik</SectionTitle>
            <div className="bg-white border border-slate-200 divide-y divide-slate-100">
              {commune.gastronomy.map((item, i) => (
                <div key={i} className="px-4 py-3 text-sm text-slate-700 leading-snug">{item}</div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Festival ak Fèt</SectionTitle>
            <div className="bg-white border border-slate-200 divide-y divide-slate-100">
              {commune.festivals.map((item, i) => (
                <div key={i} className="px-4 py-3 text-sm text-slate-700 leading-snug">{item}</div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Facts ── */}
        <section>
          <SectionTitle>Sa ou pa te konn</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commune.facts.map((fact, i) => (
              <div key={i} className="bg-white border border-slate-200 p-5">
                <span className="text-4xl font-black text-slate-100 leading-none block mb-3 select-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA bas ── */}
        <div className="bg-slate-900 px-8 py-10 sm:px-12 sm:py-14 text-center">
          <p className="text-white font-black text-2xl sm:text-4xl mb-2 tracking-tight leading-none">
            Ou vle viv nan {commune.name.split(" ")[0]}?
          </p>
          <p className="text-slate-500 text-sm mb-7 mt-3">
            Wè tout pwopriyete disponib — lwaye, vann, kay, terin
          </p>
          <Link
            href={`/listings?commune=${encodeURIComponent(commune.name.split(" ")[0])}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-caribbean-600 hover:bg-caribbean-500 text-white font-bold text-sm transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Wè Anons nan {commune.name.split(" ")[0]}
          </Link>
        </div>

      </div>
    </div>
  );
}
