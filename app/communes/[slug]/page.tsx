import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Users, Ruler, Building2, ChevronLeft, ExternalLink,
  Landmark, Utensils, Music, Lightbulb, User, Star,
} from "lucide-react";
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

const PLACE_TYPE_COLORS: Record<CommunePlace["type"], string> = {
  plaj:      "bg-blue-50 text-blue-700 border-blue-200",
  mòn:       "bg-green-50 text-green-700 border-green-200",
  patrimwan: "bg-amber-50 text-amber-700 border-amber-200",
  restoran:  "bg-orange-50 text-orange-700 border-orange-200",
  mache:     "bg-purple-50 text-purple-700 border-purple-200",
  natirèl:   "bg-teal-50 text-teal-700 border-teal-200",
};

export default async function CommunePage({ params }: Props) {
  const { slug } = await params;
  const commune = getCommuneBySlug(slug);
  if (!commune) notFound();

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero ── */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src={commune.coverImage}
          alt={commune.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retounen Akèy
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 right-4">
          <p className="text-caribbean-300 text-sm font-semibold uppercase tracking-widest mb-1">
            Depatman {commune.department}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
            {commune.name}
          </h1>
          <p className="text-white/80 text-base sm:text-lg">{commune.tagline}</p>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: Users,    label: "Popilasyon",  value: commune.population },
            { icon: Ruler,    label: "Sipèfisi",    value: commune.superficie },
            { icon: MapPin,   label: "Altitid",     value: commune.altitude   },
            { icon: Building2,label: "Depatman",    value: commune.department },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="py-2">
              <Icon className="w-4 h-4 text-caribbean-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ── CTA Anons ── */}
        <div className="bg-gradient-to-r from-caribbean-700 to-caribbean-500 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Chèche Kay nan {commune.name}</p>
            <p className="text-caribbean-100 text-sm mt-0.5">
              Wè tout anons disponib — lwaye, vann, studio, villa
            </p>
          </div>
          <Link
            href={`/listings?commune=${encodeURIComponent(commune.name.split(" ")[0])}`}
            className="shrink-0 px-5 py-2.5 bg-white text-caribbean-700 font-bold text-sm rounded-xl hover:bg-caribbean-50 transition-all flex items-center gap-2"
          >
            Wè Anons
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Istwa ── */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-5">
            <Landmark className="w-5 h-5 text-caribbean-600" />
            Istwa {commune.name.split(" ")[0]}
          </h2>
          <div className="space-y-4">
            {commune.history.map((para, i) => (
              <p key={i} className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── Kote pou Vizite ── */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-5">
            <MapPin className="w-5 h-5 text-caribbean-600" />
            Kote pou Vizite
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commune.places.map((place) => (
              <div
                key={place.name}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-caribbean-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-slate-900">{place.name}</h3>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${PLACE_TYPE_COLORS[place.type]}`}>
                    {PLACE_TYPE_LABELS[place.type]}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{place.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ofisyèl yo ── */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-5">
            <User className="w-5 h-5 text-caribbean-600" />
            Ofisyèl yo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Mayor aktiyèl */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-bold text-caribbean-700 uppercase tracking-wide mb-3">
                Mayor Aktiyèl
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-caribbean-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-caribbean-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{commune.currentMayor.name}</p>
                  <p className="text-xs text-slate-500">{commune.currentMayor.period}</p>
                  {commune.currentMayor.party && (
                    <p className="text-xs text-slate-400">{commune.currentMayor.party}</p>
                  )}
                </div>
              </div>

              {commune.formerMayors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Ansyen Mayor yo</p>
                  <ul className="space-y-1.5">
                    {commune.formerMayors.map((m) => (
                      <li key={m.name} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium">{m.name}</span>
                        <span className="text-slate-400">{m.period}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Depite + Senatè */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold text-caribbean-700 uppercase tracking-wide mb-3">
                  Depite / Senatè
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{commune.currentDeputy.name}</p>
                    <p className="text-xs text-slate-500">{commune.currentDeputy.title}</p>
                    <p className="text-xs text-slate-400">{commune.currentDeputy.period}</p>
                  </div>
                </div>
                {commune.senator && (
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{commune.senator.name}</p>
                      <p className="text-xs text-slate-500">{commune.senator.title}</p>
                      <p className="text-xs text-slate-400">{commune.senator.period}</p>
                    </div>
                  </div>
                )}

                {commune.formerDeputies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Ansyen Depite yo</p>
                    <ul className="space-y-1.5">
                      {commune.formerDeputies.map((d) => (
                        <li key={d.name} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 font-medium">{d.name}</span>
                          <span className="text-slate-400">{d.period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Ekonomi ── */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
            <Building2 className="w-5 h-5 text-caribbean-600" />
            Ekonomi
          </h2>
          <ul className="space-y-2">
            {commune.economy.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 bg-caribbean-500 rounded-full mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Gastronomik + Festival ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Utensils className="w-5 h-5 text-caribbean-600" />
              Gastronomik
            </h2>
            <ul className="space-y-2">
              {commune.gastronomy.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-white rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-base">🍽️</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <Music className="w-5 h-5 text-caribbean-600" />
              Festival ak Fèt
            </h2>
            <ul className="space-y-2">
              {commune.festivals.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-white rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-base">🎉</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Facts ── */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
            <Lightbulb className="w-5 h-5 text-caribbean-600" />
            Sa ou pa te konn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commune.facts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA bas ── */}
        <div className="bg-slate-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-1">Ou vle viv nan {commune.name.split(" ")[0]}?</p>
          <p className="text-slate-400 text-sm mb-4">
            Wè tout pwopriyete disponib — lwaye, vann, kay, terin
          </p>
          <Link
            href={`/listings?commune=${encodeURIComponent(commune.name.split(" ")[0])}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-caribbean-600 hover:bg-caribbean-500 text-white font-bold rounded-xl transition-all"
          >
            <MapPin className="w-4 h-4" />
            Wè Anons nan {commune.name.split(" ")[0]}
          </Link>
        </div>

      </div>
    </div>
  );
}
