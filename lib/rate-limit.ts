/**
 * In-memory rate limiter — pa bezwen Redis pou volim aktyèl la.
 * Limit yo reyèlman efikas pou pwoteje AI endpoints kont spam.
 *
 * NOTE: Chak instance sèvè gen pwòp store li. Si ou scale
 * a plizyè instances, migre nan Upstash Redis.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Netwaye entri ekspire chak minit pou evite memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export interface RateLimitOptions {
  /** Nimewo maksimòm demann nan fenèt tan an */
  limit: number;
  /** Fenèt tan an an milisegond */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // ms anvan reset
}

export function checkRateLimit(
  key: string,
  opts: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.limit - 1, resetIn: opts.windowMs };
  }

  if (entry.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: opts.limit - entry.count, resetIn: entry.resetAt - now };
}

// ── Limites predefini ────────────────────────────────────────────────────────

/** 10 jenerasyon AI pa itilizatè pa 10 minit */
export const AI_GENERATE_LIMIT = { limit: 10, windowMs: 10 * 60_000 };

/** 5 tradiksyon pa itilizatè pa 5 minit */
export const AI_TRANSLATE_LIMIT = { limit: 5, windowMs: 5 * 60_000 };

/** 20 rechèch AI pa IP pa minit */
export const AI_SEARCH_LIMIT = { limit: 20, windowMs: 60_000 };

/** 3 rapò pa itilizatè pa jou */
export const REPORT_LIMIT = { limit: 3, windowMs: 24 * 60 * 60_000 };
