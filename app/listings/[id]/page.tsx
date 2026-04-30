export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, Bath, Ruler, Wifi, Zap, Droplets, Car,
  Flame, BadgeCheck, Eye, MessageCircle, Share2, Flag,
  ChevronLeft, Phone, Star
} from "lucide-react";
import { getPropertyById, getSimilarProperties } from "@/lib/supabase/queries";
import { formatPrice, getPropertyTypeLabel, buildWhatsAppUrl, getPropertyRef, timeAgo } from "@/lib/utils";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return { title: "Pa Jwenn" };
  return {
    title: property.title,
    description: property.description ?? `${getPropertyTypeLabel(property.property_type)} nan ${property.location?.commune}`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const whatsappUrl = property.owner?.whatsapp
    ? buildWhatsAppUrl(property.owner.whatsapp, property)
    : null;

  const ref = getPropertyRef(property.id);
  const price = property.price_monthly ?? property.price_sale;
  const priceLabel = property.listing_type === "sale" ? "(Vann)" : "/ mwa";

  const amenities = [
    { show: property.has_water,       icon: Droplets, label: "Dlo Kouran",       color: "text-blue-600 bg-blue-50"    },
    { show: property.has_electricity, icon: Zap,       label: "Elektrisite EDH",  color: "text-yellow-600 bg-yellow-50" },
    { show: property.has_generator,   icon: Flame,     label: "Jenerate",         color: "text-orange-600 bg-orange-50" },
    { show: property.has_internet,    icon: Wifi,       label: "Wi-Fi Entènèt",   color: "text-indigo-600 bg-indigo-50" },
    { show: property.has_parking,     icon: Car,        label: "Garaj / Pakin",   color: "text-slate-600 bg-slate-50"  },
    { show: property.is_furnished,    icon: Star,       label: "Mèble Konplèt",   color: "text-purple-600 bg-purple-50" },
  ].filter((a) => a.show);

  const similar = property.location?.commune
    ? await getSimilarProperties(property.id, property.location.commune)
    : [];

  const photos = property.photos ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700 transition-colors">Akèy</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <Link href="/listings" className="hover:text-slate-700 transition-colors">Anons</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <Link
          href={`/listings?commune=${property.location?.commune}`}
          className="hover:text-slate-700 transition-colors"
        >
          {property.location?.commune}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="text-slate-400 truncate max-w-[200px]">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Photos + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo gallery */}
          <div className="rounded-2xl overflow-hidden bg-slate-100">
            {photos.length > 0 ? (
              <div>
                {/* Main photo */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={photos[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm">
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                    {property.is_featured && (
                      <span className="badge bg-sunset-500 text-white">Vedèt</span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="badge bg-white/90 backdrop-blur-sm text-xs text-slate-500">
                      Ref: {ref}
                    </span>
                  </div>
                </div>

                {/* Thumbnail strip */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto photo-gallery">
                    {photos.slice(1).map((photo, i) => (
                      <div
                        key={photo.id}
                        className="relative w-24 h-16 shrink-0 rounded-xl overflow-hidden"
                      >
                        <Image
                          src={photo.url}
                          alt={`Photo ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/9] flex items-center justify-center text-slate-400">
                <p className="text-sm">Pa gen foto disponib</p>
              </div>
            )}
          </div>

          {/* Title + Key Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-caribbean-600 shrink-0" />
                  {property.location?.neighborhood && `${property.location.neighborhood}, `}
                  {property.location?.commune} &middot; {property.location?.department}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Pataje">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Rapòte">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-slate-100">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <BedDouble className="w-4 h-4 text-caribbean-600" />
                  <span>{property.bedrooms} chanm</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Bath className="w-4 h-4 text-caribbean-600" />
                  <span>{property.bathrooms} saldeben</span>
                </div>
              )}
              {property.area_sqm && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Ruler className="w-4 h-4 text-caribbean-600" />
                  <span>{property.area_sqm} m²</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {property.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {property.contact_count}
                </span>
                <span>Poste {timeAgo(property.created_at)} de sa</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-3">Deskripsyon</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-4">Sèvis ak Ekipman</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map(({ icon: Icon, label, color }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${color.split(" ")[1]}`}>
                    <Icon className={`w-5 h-5 ${color.split(" ")[0]} shrink-0`} />
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location (placeholder for map) */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Lokalizasyon</h2>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-caribbean-600 mt-0.5 shrink-0" />
              <div>
                {property.address_text && (
                  <p className="text-slate-700 text-sm font-medium">{property.address_text}</p>
                )}
                <p className="text-slate-500 text-sm">
                  {property.location?.neighborhood && `${property.location.neighborhood} · `}
                  {property.location?.commune} · {property.location?.department}
                </p>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-caribbean-50 to-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
              <div className="text-center text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-caribbean-400" />
                <p className="text-sm">Kat disponib apre konfigurasyon Google Maps API</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Contact + Owner */}
        <div className="space-y-5">
          {/* Price card */}
          <div className="card p-6 sticky top-20">
            {/* Price */}
            <div className="mb-5">
              {price ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-caribbean-700">
                      {formatPrice(price, property.currency)}
                    </span>
                    <span className="text-slate-400 text-sm">{priceLabel}</span>
                  </div>
                  {property.listing_type === "both" && property.price_sale && (
                    <p className="text-sm text-slate-500 mt-1">
                      Oswa achte pou {formatPrice(property.price_sale, property.currency)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xl font-bold text-slate-500">Pri sou demann</p>
              )}

              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`badge ${
                    property.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {property.status === "active" ? "Disponib" : "Pa Disponib"}
                </span>
                {property.listing_type !== "sale" && (
                  <span className="badge bg-caribbean-100 text-caribbean-700">
                    {property.listing_type === "rent" ? "Pou Lwaye" : "Lwaye/Vann"}
                  </span>
                )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full text-base py-3.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Kontakte sou WhatsApp
              </a>
            ) : (
              <button className="btn-primary w-full py-3.5">
                <Phone className="w-5 h-5" />
                Wè Nimewo Telefòn
              </button>
            )}

            <p className="text-xs text-slate-400 text-center mt-3">
              Mesaj la ap voye ak referans anons nan otomatikman
            </p>

            {/* Divider */}
            <div className="border-t border-slate-100 my-5" />

            {/* Owner card */}
            {property.owner && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  {property.owner.role === "agent" ? "Ajan" : "Mèt Kay"}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {property.owner.avatar_url ? (
                      <img
                        src={property.owner.avatar_url}
                        alt={property.owner.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-bold">
                        {property.owner.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {property.owner.full_name}
                    </p>
                    {property.owner.is_verified && (
                      <span className="flex items-center gap-1 text-xs text-caribbean-600 mt-0.5">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verifye ofisyèlman
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Report */}
            <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition-colors mt-4 mx-auto">
              <Flag className="w-3.5 h-3.5" />
              Rapòte anons sa a
            </button>
          </div>

          {/* Safety tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-semibold text-amber-800 text-sm mb-2">Konsèy Sekirite</h4>
            <ul className="space-y-1.5 text-xs text-amber-700">
              <li>• Pa janm peye avans san vizite kay la dabò</li>
              <li>• Verifye dokiman mèt kay la toujou</li>
              <li>• Ekri yon kontra alèkri anvan ou emménage</li>
              <li>• Si ou sispèk yon eskwok, klike &quot;Rapòte&quot;</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Pwopriyete Similè nan {property.location?.commune}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
