"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireAdmin, handleGuardError } from "@/lib/auth/guards";
import { PropertyFormSchema, UuidSchema } from "@/lib/validators/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteFromR2 } from "@/lib/r2";
import { moderateListing } from "@/lib/ai/moderate";
import type { SupabaseClient } from "@supabase/supabase-js";

// ── Helper ───────────────────────────────────────────────────────────────────

async function getLocationId(
  supabase: SupabaseClient,
  commune: string,
  neighborhood: string
): Promise<number | null> {
  let query = supabase.from("locations").select("id").eq("commune", commune);
  if (neighborhood) {
    query = query.eq("neighborhood", neighborhood);
  } else {
    query = query.is("neighborhood", null);
  }
  const { data } = await query.maybeSingle();
  return data?.id ?? null;
}

// ── Create ───────────────────────────────────────────────────────────────────

export async function createProperty(
  rawInput: unknown
): Promise<{ error?: string; id?: string; moderation?: { decision: string; reason: string } }> {
  // 1. Validate input
  const parsed = PropertyFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }
  const formData = parsed.data;

  // 2. Auth guard
  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  // 3. Resolve location
  const locationId = await getLocationId(supabase, formData.commune, formData.neighborhood);
  if (!locationId) return { error: "Komin oswa katye sa a pa jwenn nan sistèm lan." };

  // 4. AI moderation (fire and handle, pa bloke si echèk)
  const moderation = await moderateListing({
    title:        formData.title,
    description:  formData.description,
    property_type: formData.property_type,
    listing_type:  formData.listing_type,
    price_monthly: formData.price_monthly ? Number(formData.price_monthly) : null,
    price_sale:    formData.price_sale    ? Number(formData.price_sale)    : null,
    commune:       formData.commune,
  });

  const status =
    moderation.decision === "approved" ? "active"       :
    moderation.decision === "rejected" ? "suspended"    :
    "pending_review";

  // 5. Insert
  const { data, error } = await supabase
    .from("properties")
    .insert({
      owner_id:       user.id,
      location_id:    locationId,
      title:          formData.title,
      description:    formData.description || null,
      property_type:  formData.property_type,
      listing_type:   formData.listing_type,
      currency:       formData.currency,
      price_monthly:  formData.price_monthly ? Number(formData.price_monthly) : null,
      price_sale:     formData.price_sale    ? Number(formData.price_sale)    : null,
      bedrooms:       formData.bedrooms,
      bathrooms:      formData.bathrooms,
      area_sqm:       formData.area_sqm ? Number(formData.area_sqm) : null,
      is_furnished:   formData.is_furnished,
      has_water:      formData.has_water,
      has_electricity:formData.has_electricity,
      has_generator:  formData.has_generator,
      has_parking:    formData.has_parking,
      has_internet:   formData.has_internet,
      address_text:   formData.address_text || null,
      status,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  return { id: data.id, moderation };
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateProperty(
  id: string,
  rawInput: unknown
): Promise<{ error?: string }> {
  // 1. Validate
  const idParsed = UuidSchema.safeParse(id);
  if (!idParsed.success) return { error: "ID anons envalid." };

  const parsed = PropertyFormSchema.safeParse(rawInput);
  if (!parsed.success) return { error: parsed.error.errors[0].message };
  const formData = parsed.data;

  // 2. Auth
  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  // 3. Resolve location
  const locationId = await getLocationId(supabase, formData.commune, formData.neighborhood);
  if (!locationId) return { error: "Komin oswa katye sa a pa jwenn nan sistèm lan." };

  // 4. Update — .eq("owner_id") garanti mèt pwopriyete a sèlman ka edite
  const { error } = await supabase
    .from("properties")
    .update({
      location_id:    locationId,
      title:          formData.title,
      description:    formData.description || null,
      property_type:  formData.property_type,
      listing_type:   formData.listing_type,
      currency:       formData.currency,
      price_monthly:  formData.price_monthly ? Number(formData.price_monthly) : null,
      price_sale:     formData.price_sale    ? Number(formData.price_sale)    : null,
      bedrooms:       formData.bedrooms,
      bathrooms:      formData.bathrooms,
      area_sqm:       formData.area_sqm ? Number(formData.area_sqm) : null,
      is_furnished:   formData.is_furnished,
      has_water:      formData.has_water,
      has_electricity:formData.has_electricity,
      has_generator:  formData.has_generator,
      has_parking:    formData.has_parking,
      has_internet:   formData.has_internet,
      address_text:   formData.address_text || null,
      updated_at:     new Date().toISOString(),
    })
    .eq("id", idParsed.data)
    .eq("owner_id", user.id); // ownership check côté DB

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  revalidatePath(`/listings/${id}`);
  return {};
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteProperty(id: string): Promise<{ error?: string }> {
  const idParsed = UuidSchema.safeParse(id);
  if (!idParsed.success) return { error: "ID envalid." };

  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  // Chaje foto anvan efasaj pou netwaye R2
  const { data: photos } = await supabase
    .from("property_photos")
    .select("url")
    .eq("property_id", idParsed.data);

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", idParsed.data)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  // Efase foto nan R2 an background (pa bloke si echèk)
  if (photos?.length) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
    for (const photo of photos) {
      const key = photo.url.replace(`${publicUrl}/`, "");
      deleteFromR2(key).catch(console.warn);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

// ── Admin: Approve / Reject ──────────────────────────────────────────────────

export async function approveProperty(id: string): Promise<void> {
  if (!UuidSchema.safeParse(id).success) return;

  try {
    await requireAdmin();
  } catch {
    return;
  }

  const admin = createAdminClient();
  await admin
    .from("properties")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/listings");
}

export async function rejectProperty(id: string): Promise<void> {
  if (!UuidSchema.safeParse(id).success) return;

  try {
    await requireAdmin();
  } catch {
    return;
  }

  const admin = createAdminClient();
  await admin
    .from("properties")
    .update({ status: "suspended", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/listings");
}
