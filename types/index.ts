export type UserRole = "tenant" | "owner" | "agent" | "admin";
export type ListingType = "rent" | "sale" | "both";
export type PropertyType =
  | "chambrette"
  | "studio"
  | "appartement"
  | "kay_2_chanm"
  | "kay_3_chanm"
  | "kay_4_chanm"
  | "te"
  | "villa";
export type PropertyStatus =
  | "active"
  | "rented"
  | "sold"
  | "suspended"
  | "pending_review";
export type Currency = "HTG" | "USD";

export interface Location {
  id: number;
  department: string;
  commune: string;
  neighborhood: string | null;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  is_premium: boolean;
  whatsapp: string | null;
  created_at: string;
}

export interface PropertyPhoto {
  id: number;
  property_id: string;
  url: string;
  is_cover: boolean;
  display_order: number;
}

export interface Property {
  id: string;
  owner_id: string;
  location_id: number;
  title: string;
  description: string | null;
  property_type: PropertyType;
  price_monthly: number | null;
  price_sale: number | null;
  listing_type: ListingType;
  currency: Currency;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number | null;
  is_furnished: boolean;
  has_water: boolean;
  has_electricity: boolean;
  has_generator: boolean;
  has_parking: boolean;
  has_internet: boolean;
  status: PropertyStatus;
  is_featured: boolean;
  view_count: number;
  contact_count: number;
  address_text: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  location?: Location;
  photos?: PropertyPhoto[];
  owner?: User;
}

export interface SearchFilters {
  commune?: string;
  neighborhood?: string;
  property_type?: PropertyType | "";
  listing_type?: ListingType | "";
  min_price?: number | "";
  max_price?: number | "";
  bedrooms?: number | "";
  is_furnished?: boolean;
  currency?: Currency;
}

export type ReportReason =
  | "fake_listing"
  | "wrong_price"
  | "wrong_location"
  | "scam"
  | "duplicate"
  | "other";

export type ReportStatus = "open" | "resolved" | "dismissed";

export interface Report {
  id: number;
  property_id: string;
  reporter_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  created_at: string;
}
