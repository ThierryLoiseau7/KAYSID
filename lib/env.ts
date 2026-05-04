/**
 * Validation env vars au démarrage.
 * Si yon var kritik manke, app la kraze IMEDYATMAN ak yon mesaj klè
 * olye pou l kraze nan yon fason obskur pi devan.
 */
import { z } from "zod";

const EnvSchema = z.object({
  // ── Supabase (obligatwa) ─────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url("NEXT_PUBLIC_SUPABASE_URL dwe yon URL valid"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, "NEXT_PUBLIC_SUPABASE_ANON_KEY manke"),
  SUPABASE_SERVICE_ROLE_KEY:     z.string().min(10, "SUPABASE_SERVICE_ROLE_KEY manke"),

  // ── AI (obligatwa) ───────────────────────────────────────────────────────
  GROQ_API_KEY: z.string().startsWith("gsk_", "GROQ_API_KEY dwe kòmanse ak 'gsk_'"),

  // ── App ──────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SITE_URL:               z.string().url().optional(),
  NEXT_PUBLIC_WHATSAPP_COUNTRY_CODE:  z.string().default("509"),

  // ── Cloudflare R2 (opsyonèl — app fonksyone san foto) ───────────────────
  R2_ACCOUNT_ID:           z.string().optional(),
  R2_ACCESS_KEY_ID:        z.string().optional(),
  R2_SECRET_ACCESS_KEY:    z.string().optional(),
  R2_BUCKET_NAME:          z.string().optional(),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.errors
    .map((e) => `  • ${e.path.join(".")}: ${e.message}`)
    .join("\n");
  // eslint-disable-next-line no-console
  console.error(`\n❌ Konfigirasyon ankò manke:\n${issues}\n`);
  throw new Error("Env vars envalid — verifye .env.local ou");
}

export const env = parsed.data;
