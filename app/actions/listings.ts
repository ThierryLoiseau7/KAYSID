"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, handleGuardError } from "@/lib/auth/guards";
import { logger } from "@/lib/logger";
import { FavoriteSchema, ReportSchema, UuidSchema } from "@/lib/validators/schemas";
import { checkRateLimit, REPORT_LIMIT } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

// ── View Count ───────────────────────────────────────────────────────────────

export async function incrementViewCount(propertyId: string): Promise<void> {
  if (!UuidSchema.safeParse(propertyId).success) return;
  try {
    const admin = createAdminClient();
    await admin.rpc("increment_view_count", { property_id: propertyId });
  } catch {
    // Fire-and-forget — pa bloke rendering si echèk
  }
}

// ── Contact Count ────────────────────────────────────────────────────────────

export async function incrementContactCount(propertyId: string): Promise<void> {
  if (!UuidSchema.safeParse(propertyId).success) return;
  try {
    const admin = createAdminClient();
    await admin.rpc("increment_contact_count", { property_id: propertyId });
  } catch {}
}

// ── Favorites ────────────────────────────────────────────────────────────────

export async function toggleFavorite(
  propertyId: string
): Promise<{ isFavorite: boolean; error?: string }> {
  // Validate input
  const validated = FavoriteSchema.safeParse({ propertyId });
  if (!validated.success) return { isFavorite: false, error: "ID anons envalid." };

  // Auth guard
  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { isFavorite: false, error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  const pid = validated.data.propertyId;

  // Attempt INSERT — unique constraint on (user_id, property_id) catches race duplicates
  const { error: insertError } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, property_id: pid });

  if (!insertError) return { isFavorite: true };

  // Unique violation (23505) → already favorited → toggle off
  if (insertError.code === "23505") {
    const { error: delError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", pid);

    if (delError) return { isFavorite: true, error: "Erè sèvè. Eseye ankò." };
    return { isFavorite: false };
  }

  return { isFavorite: false, error: insertError.message };
}

export async function getUserFavoriteIds(): Promise<string[]> {
  try {
    const { user, supabase } = await requireAuth();
    const { data } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id);
    return data?.map((f: { property_id: string }) => f.property_id) ?? [];
  } catch {
    return [];
  }
}

// ── Reports ──────────────────────────────────────────────────────────────────

export async function reportListing(
  propertyId: string,
  reason: string,
  details?: string
): Promise<{ error?: string }> {
  // Validate all inputs together
  const validated = ReportSchema.safeParse({ propertyId, reason, details });
  if (!validated.success) return { error: validated.error.errors[0].message };

  // Auth guard
  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  // Rate limit: 3 rapò pa jou pa itilizatè
  const rl = checkRateLimit(`report:${user.id}`, REPORT_LIMIT);
  if (!rl.allowed) {
    return { error: "Ou rapòte twòp anons jodi a. Eseye demen." };
  }

  const { error } = await supabase.from("reports").insert({
    property_id: validated.data.propertyId,
    reporter_id: user.id,
    reason:      validated.data.reason,
    details:     validated.data.details ?? null,
  });

  if (error) {
    logger.error("reportListing insert failed", { message: error.message, propertyId: validated.data.propertyId });
    return { error: error.message };
  }
  revalidatePath(`/listings/${validated.data.propertyId}`);
  return {};
}
