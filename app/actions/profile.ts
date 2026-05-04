"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, handleGuardError } from "@/lib/auth/guards";
import { ProfileSchema } from "@/lib/validators/schemas";

// ── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfile(
  rawInput: unknown
): Promise<{ error?: string }> {
  // 1. Validate
  const parsed = ProfileSchema.safeParse(rawInput);
  if (!parsed.success) return { error: parsed.error.errors[0].message };
  const data = parsed.data;

  // 2. Auth
  let auth: Awaited<ReturnType<typeof requireAuth>>;
  try {
    auth = await requireAuth();
  } catch (err) {
    return { error: handleGuardError(err) };
  }
  const { user, supabase } = auth;

  // 3. Update
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name:  data.full_name,
      phone:      data.phone  || null,
      whatsapp:   data.whatsapp || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return {};
}

// ── Get Profile ──────────────────────────────────────────────────────────────

export interface ProfileData {
  full_name:   string | null;
  phone:       string | null;
  whatsapp:    string | null;
  email:       string | null;
  role:        string | null;
  is_verified: boolean | null;
  avatar_url:  string | null;
}

export async function getProfile(): Promise<ProfileData | null> {
  try {
    const { user, supabase } = await requireAuth();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, whatsapp, email, role, is_verified, avatar_url")
      .eq("id", user.id)
      .single();
    return data as ProfileData | null;
  } catch {
    return null;
  }
}
