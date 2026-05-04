export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, Bath, Ruler, Wifi, Zap, Droplets, Car,
  Flame, BadgeCheck, Eye, MessageCircle,
  ChevronLeft, Star
} from "lucide-react";
import { getPropertyById, getSimilarProperties } from "@/lib/supabase/queries";
import { formatPrice, getPropertyTypeLabel, buildWhatsAppUrl, getPropertyRef, timeAgo } from "@/lib/utils";
import PropertyCard from "@/components/properties/PropertyCard";
import DescriptionTranslator from "@/components/listings/DescriptionTranslator";
import ViewTracker from "@/components/listings/ViewTracker";
import ListingActions from "@/components/listings/ListingActions";
import CommuneMap from "@/components/listings/CommuneMap";
import type { Property } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) return { title: "Pa Jwenn" };
    return {
      title: property.title,
      description: property.description ?? `${getPropertyTypeLabel(property.property_type)} nan ${property.location?.commune}`,
    };
  } catch {
    return { title: "PouPiyay" };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  let property = null;
  try {
    property = await getPropertyById(id);
  } catch {
    notFound();
  }
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

  // JSON-LD structured data pou Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? "",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/listings/${property.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location?.commune,
      addressRegion: property.location?.department,
      addressCountry: "HT",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: property.currency,
      },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker propertyId={property.id} />
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
              <div className="flex-1 min-w-0">
                <DescriptionTranslator title={property.title} description={property.description ?? ""} />
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-caribbean-600 shrink-0" />
                  {property.location?.neighborhood && `${property.location.neighborhood}, `}
                  {property.location?.commune} &middot; {property.location?.department}
                </div>
              </div>
              <ListingActions propertyId={property.id} whatsappUrl={null} />
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
              <DescriptionTranslator title={property.title} description={property.description} descriptionOnly />
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
            <CommuneMap
              commune={property.location?.commune}
              neighborhood={property.location?.neighborhood ?? undefined}
            />
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
            <ListingActions
              propertyId={property.id}
              whatsappUrl={whatsappUrl}
              whatsappLabel="Kontakte sou WhatsApp"
            />

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
