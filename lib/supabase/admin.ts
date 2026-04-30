import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client — utilise SERVICE_ROLE_KEY pou bypasse RLS konplètman.
 * Sèlman pou server-side admin operations (approve, reject, list all properties).
 * PA JANM ekspoze sa sou klient.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase admin env vars manke: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
