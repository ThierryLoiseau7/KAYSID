import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// ── Error types ──────────────────────────────────────────────────────────────

export class AuthError extends Error {
  readonly code = "AUTH_REQUIRED" as const;
  constructor() { super("Ou dwe konekte pou fè aksyon sa a."); }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN" as const;
  constructor() { super("Ou pa gen pèmisyon pou fè aksyon sa a."); }
}

// ── Guard helpers ────────────────────────────────────────────────────────────

export type AuthContext = { user: User; supabase: SupabaseClient };

/**
 * Verifye ke itilizatè a konekte.
 * @throws AuthError si pa konekte
 */
export async function requireAuth(): Promise<AuthContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthError();
  return { user, supabase };
}

/**
 * Verifye ke itilizatè a se admin.
 * @throws AuthError si pa konekte
 * @throws ForbiddenError si pa admin
 */
export async function requireAdmin(): Promise<AuthContext> {
  const { user, supabase } = await requireAuth();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new ForbiddenError();
  return { user, supabase };
}

/**
 * Konvèti erè guards yo an mesaj itilizatè.
 */
export function handleGuardError(err: unknown): string {
  if (err instanceof AuthError)    return err.message;
  if (err instanceof ForbiddenError) return err.message;
  return "Erè entèn. Eseye ankò.";
}
