import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Property, Currency } from "@/types";
import { PROPERTY_TYPE_LABELS, WHATSAPP_MESSAGE_TEMPLATE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: Currency = "USD"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("fr-HT", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " HTG";
}

export function getPropertyTypeLabel(type: Property["property_type"]): string {
  return PROPERTY_TYPE_LABELS[type] ?? type;
}

export function getPropertyRef(id: string): string {
  return `KS-${id.slice(-6).toUpperCase()}`;
}

export function buildWhatsAppUrl(phone: string, property: Property): string {
  const ref = getPropertyRef(property.id);
  const message = WHATSAPP_MESSAGE_TEMPLATE(property.title, ref);
  const clean = phone.replace(/\D/g, "");
  const full = clean.startsWith("509") ? clean : `509${clean}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}

export function getCoverPhoto(property: Property): string {
  const cover = property.photos?.find((p) => p.is_cover);
  if (cover) return cover.url;
  if (property.photos && property.photos.length > 0) return property.photos[0].url;
  return "/placeholder-property.svg";
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minit`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} è`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} jou`;
  const months = Math.floor(days / 30);
  return `${months} mwa`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
