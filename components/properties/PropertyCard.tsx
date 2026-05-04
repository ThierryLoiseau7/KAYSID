"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Wifi, Zap, Droplets, Car, BadgeCheck, Star } from "lucide-react";
import { cn, formatPrice, getPropertyTypeLabel, getCoverPhoto, timeAgo } from "@/lib/utils";
import type { Property } from "@/types";
import FavoriteButton from "@/components/listings/FavoriteButton";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  className?: string;
  horizontal?: boolean;
}

export default function PropertyCard({
  property,
  isFavorite = false,
  className,
  horizontal = false,
}: PropertyCardProps) {
  const cover = getCoverPhoto(property);
  const price = property.price_monthly ?? property.price_sale;
  const priceLabel = property.listing_type === "sale" ? "Vann" : "/mwa";

  const amenicons = [
    { show: property.has_water,       icon: Droplets, label: "Dlo"    },
    { show: property.has_electricity, icon: Zap,      label: "Kouran" },
    { show: property.has_internet,    icon: Wifi,     label: "Wi-Fi"  },
    { show: property.has_parking,     icon: Car,      label: "Garaj"  },
  ];

  if (horizontal) {
    return (
      <article
        className={cn(
          "bg-white rounded-xl border border-slate-200 hover:border-caribbean-300 hover:shadow-md transition-all overflow-hidden flex",
          className
        )}
      >
        {/* Photo */}
        <Link href={`/listings/${property.id}`} className="relative shrink-0 w-40 sm:w-52 bg-slate-100">
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 160px, 208px"
          />
          {/* Listing type */}
          <span
            className={cn(
              "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold",
              property.listing_type === "sale"
                ? "bg-caribbean-700 text-white"
                : "bg-green-600 text-white"
            )}
          >
            {property.listing_type === "rent" ? "Lwaye" : property.listing_type === "sale" ? "Vann" : "Lwaye/Vann"}
          </span>
          {property.is_featured && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-sunset-500 text-white rounded-full text-[10px] font-bold flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" /> Vedèt
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Property type badge */}
              <span className="inline-block text-[10px] font-semibold text-caribbean-700 bg-caribbean-50 px-2 py-0.5 rounded-full mb-1.5">
                {getPropertyTypeLabel(property.property_type)}
              </span>
              {/* Title */}
              <Link href={`/listings/${property.id}`}>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-caribbean-700 transition-colors">
                  {property.title}
                </h3>
              </Link>
            </div>
            <FavoriteButton propertyId={property.id} initialFavorite={isFavorite} variant="card-horizontal" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
            <MapPin className="w-3 h-3 text-caribbean-500 shrink-0" />
            <span className="truncate">
              {property.location?.neighborhood ? `${property.location.neighborhood}, ` : ""}
              {property.location?.commune}
            </span>
            {property.owner?.is_verified && (
              <span className="ml-auto flex items-center gap-0.5 text-caribbean-600 shrink-0">
                <BadgeCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Verifye</span>
              </span>
            )}
          </div>

          {/* Specs */}
          {(property.bedrooms > 0 || property.bathrooms > 0 || property.area_sqm) && (
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.bedrooms} chanm</span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} sdb</span>
              )}
              {property.area_sqm && <span>{property.area_sqm} m²</span>}
            </div>
          )}

          {/* Amenities */}
          <div className="flex items-center gap-1.5 mt-2">
            {amenicons.filter((a) => a.show).slice(0, 4).map(({ icon: Icon, label }) => (
              <span key={label} title={label} className="w-5 h-5 rounded bg-caribbean-50 flex items-center justify-center text-caribbean-600">
                <Icon className="w-3 h-3" />
              </span>
            ))}
            {property.is_furnished && (
              <span className="text-[10px] text-caribbean-700 bg-caribbean-50 px-1.5 py-0.5 rounded-full">
                Mèble
              </span>
            )}
          </div>

          {/* Price + date */}
          <div className="flex items-end justify-between mt-auto pt-2.5 border-t border-slate-100">
            <div>
              {price ? (
                <>
                  <span className="text-base font-extrabold text-caribbean-700">
                    {formatPrice(price, property.currency)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{priceLabel}</span>
                </>
              ) : (
                <span className="text-sm text-slate-400 italic">Pri sou demann</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">{timeAgo(property.created_at)}</span>
          </div>
        </div>
      </article>
    );
  }

  // ── Vertical (grid) layout ──
  return (
    <article className={cn("bg-white rounded-xl border border-slate-200 hover:border-caribbean-300 hover:shadow-md transition-all overflow-hidden flex flex-col group", className)}>
      {/* Photo */}
      <Link href={`/listings/${property.id}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100 block">
        <Image
          src={cover}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-slate-700 shadow-sm">
            {getPropertyTypeLabel(property.property_type)}
          </span>
          {property.is_featured && (
            <span className="px-2 py-0.5 bg-sunset-500 text-white rounded-full text-[10px] font-bold flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" /> Vedèt
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm",
            property.listing_type === "sale" ? "bg-caribbean-700 text-white" : "bg-green-600 text-white"
          )}>
            {property.listing_type === "rent" ? "Lwaye" : property.listing_type === "sale" ? "Vann" : "Lwaye/Vann"}
          </span>
        </div>
        <FavoriteButton propertyId={property.id} initialFavorite={isFavorite} variant="card-grid" />
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <MapPin className="w-3 h-3 text-caribbean-500 shrink-0" />
          <span className="truncate">
            {property.location?.neighborhood ? `${property.location.neighborhood}, ` : ""}
            {property.location?.commune}
          </span>
          {property.owner?.is_verified && (
            <span className="ml-auto flex items-center gap-0.5 text-caribbean-600 shrink-0">
              <BadgeCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        <Link href={`/listings/${property.id}`}>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-caribbean-700 transition-colors mb-2">
            {property.title}
          </h3>
        </Link>

        {(property.bedrooms > 0 || property.bathrooms > 0) && (
          <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-2">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.bedrooms} chanm</span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} sdb</span>
            )}
            {property.area_sqm && <span>{property.area_sqm} m²</span>}
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-2">
          {amenicons.filter((a) => a.show).slice(0, 4).map(({ icon: Icon, label }) => (
            <span key={label} title={label} className="w-5 h-5 rounded bg-caribbean-50 flex items-center justify-center text-caribbean-600">
              <Icon className="w-3 h-3" />
            </span>
          ))}
          {property.is_furnished && (
            <span className="text-[10px] text-caribbean-700 bg-caribbean-50 px-1.5 py-0.5 rounded-full">
              Mèble
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2.5 border-t border-slate-100">
          <div>
            {price ? (
              <>
                <span className="text-base font-extrabold text-caribbean-700">
                  {formatPrice(price, property.currency)}
                </span>
                <span className="text-xs text-slate-400 ml-1">{priceLabel}</span>
              </>
            ) : (
              <span className="text-sm text-slate-400 italic">Pri sou demann</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">{timeAgo(property.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
