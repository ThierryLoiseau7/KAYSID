import { z } from "zod";
import type { PropertyType, ListingType, Currency } from "@/types";

// ── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  "chambrette", "studio", "appartement", "kay_2_chanm",
  "kay_3_chanm", "kay_4_chanm", "te", "villa",
] as const satisfies readonly PropertyType[];

const LISTING_TYPES  = ["rent", "sale", "both"]  as const satisfies readonly ListingType[];
const CURRENCIES     = ["HTG", "USD"]             as const satisfies readonly Currency[];

export const REPORT_REASONS = [
  "fake_listing", "wrong_price", "wrong_location", "scam", "duplicate", "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

// ── Schemas ──────────────────────────────────────────────────────────────────

export const PropertyFormSchema = z
  .object({
    property_type:  z.enum(PROPERTY_TYPES),
    listing_type:   z.enum(LISTING_TYPES),
    commune:        z.string().min(1, "Komin obligatwa").max(100).trim(),
    neighborhood:   z.string().max(100).trim().default(""),
    address_text:   z.string().max(300).trim().default(""),
    title:          z.string().min(5, "Tit dwe gen omwen 5 karaktè").max(100, "Tit twò long").trim(),
    description:    z.string().min(30, "Deskripsyon dwe gen omwen 30 karaktè").max(1000).trim(),
    bedrooms:       z.number().int().min(0).max(20),
    bathrooms:      z.number().int().min(0).max(20),
    area_sqm:       z.string().regex(/^\d*\.?\d*$/, "Sipèfisi envalid").default(""),
    is_furnished:   z.boolean(),
    has_water:      z.boolean(),
    has_electricity:z.boolean(),
    has_generator:  z.boolean(),
    has_parking:    z.boolean(),
    has_internet:   z.boolean(),
    currency:       z.enum(CURRENCIES),
    price_monthly:  z.string().regex(/^\d*\.?\d*$/, "Pri envalid").default(""),
    price_sale:     z.string().regex(/^\d*\.?\d*$/, "Pri envalid").default(""),
  })
  .refine(
    (d) => !(d.listing_type === "rent"  && !d.price_monthly),
    { message: "Pri lwaye obligatwa pou tip 'Lwaye'" }
  )
  .refine(
    (d) => !(d.listing_type === "sale"  && !d.price_sale),
    { message: "Pri vant obligatwa pou tip 'Vann'" }
  );

export const ProfileSchema = z.object({
  full_name: z.string().min(2, "Non twò kout").max(100).trim(),
  phone:     z.string().max(20).trim().default(""),
  whatsapp:  z.string().max(20).trim().default(""),
});

export const ReportSchema = z.object({
  propertyId: z.string().uuid("ID anons envalid"),
  reason:     z.enum(REPORT_REASONS, { errorMap: () => ({ message: "Rezon envalid" }) }),
  details:    z.string().max(500, "Detay twò long").trim().optional(),
});

export const FavoriteSchema = z.object({
  propertyId: z.string().uuid("ID anons envalid"),
});

export const UuidSchema = z.string().uuid("ID envalid");

// ── Inferred types ───────────────────────────────────────────────────────────

export type PropertyFormInput = z.infer<typeof PropertyFormSchema>;
export type ProfileInput       = z.infer<typeof ProfileSchema>;
export type ReportInput        = z.infer<typeof ReportSchema>;
