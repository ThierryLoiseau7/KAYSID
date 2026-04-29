"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteFromR2 } from "@/lib/r2";
import type { PropertyType, ListingType, Currency } from "@/types";

export interface PropertyFormData {
  property_type: PropertyType;
  listing_type: ListingType;
  commune: string;
  neighborhood: string;
  address_text: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: string;
  is_furnished: boolean;
  has_water: boolean;
  has_electricity: boolean;
  has_generator: boolean;
  has_parking: boolean;
  has_internet: boolean;
  currency: Currency;
  price_monthly: string;
  price_sale: string;
}

async function getLocationId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  commune: string,
  neighborhood: string
): Promise<number | null> {
  let query = supabase
    .from("locations")
    .select("id")
    .eq("commune", commune);

  if (neighborhood) {
    query = query.eq("neighborhood", neighborhood);
  } else {
    query = query.is("neighborhood", null);
  }

  const { data } = await query.maybeSingle();
  return data?.id ?? null;
}

export async function createProperty(formData: PropertyFormData): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ou dwe konekte pou poste yon anons." };

  const locationId = await getLocationId(supabase, formData.commune, formData.neighborhood);
  if (!locationId) return { error: "Komin oswa katye sa a pa jwenn nan sistèm lan." };

  const { data, error } = await supabase
    .from("properties")
    .insert({
      owner_id: user.id,
      location_id: locationId,
      title: formData.title,
      description: formData.description || null,
      property_type: formData.property_type,
      listing_type: formData.listing_type,
      currency: formData.currency,
      price_monthly: formData.price_monthly ? Number(formData.price_monthly) : null,
      price_sale: formData.price_sale ? Number(formData.price_sale) : null,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area_sqm: formData.area_sqm ? Number(formData.area_sqm) : null,
      is_furnished: formData.is_furnished,
      has_water: formData.has_water,
      has_electricity: formData.has_electricity,
      has_generator: formData.has_generator,
      has_parking: formData.has_parking,
      has_internet: formData.has_internet,
      address_text: formData.address_text || null,
      status: "pending_review",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  return { id: data.id };
}

export async function updateProperty(
  id: string,
  formData: PropertyFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ou dwe konekte." };

  const locationId = await getLocationId(supabase, formData.commune, formData.neighborhood);
  if (!locationId) return { error: "Komin oswa katye sa a pa jwenn nan sistèm lan." };

  const { error } = await supabase
    .from("properties")
    .update({
      location_id: locationId,
      title: formData.title,
      description: formData.description || null,
      property_type: formData.property_type,
      listing_type: formData.listing_type,
      currency: formData.currency,
      price_monthly: formData.price_monthly ? Number(formData.price_monthly) : null,
      price_sale: formData.price_sale ? Number(formData.price_sale) : null,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area_sqm: formData.area_sqm ? Number(formData.area_sqm) : null,
      is_furnished: formData.is_furnished,
      has_water: formData.has_water,
      has_electricity: formData.has_electricity,
      has_generator: formData.has_generator,
      has_parking: formData.has_parking,
      has_internet: formData.has_internet,
      address_text: formData.address_text || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  revalidatePath(`/listings/${id}`);
  return {};
}

export async function deleteProperty(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ou dwe konekte." };

  // Chaje foto yo pou efase nan R2
  const { data: photos } = await supabase
    .from("property_photos")
    .select("url")
    .eq("property_id", id);

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  // Efase foto nan R2 (background — pa bloke si echèk)
  if (photos?.length) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
    for (const photo of photos) {
      const key = photo.url.replace(publicUrl + "/", "");
      deleteFromR2(key).catch(console.warn);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function approveProperty(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ou dwe konekte." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Aksyon sa a rezève pou admin." };

  const { error } = await supabase
    .from("properties")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/listings");
  return {};
}

export async function rejectProperty(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ou dwe konekte." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Aksyon sa a rezève pou admin." };

  const { error } = await supabase
    .from("properties")
    .update({ status: "suspended", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}
