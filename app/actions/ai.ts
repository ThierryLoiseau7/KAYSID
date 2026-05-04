"use server";

import Groq from "groq-sdk";
import { headers } from "next/headers";
import { requireAuth } from "@/lib/auth/guards";
import { checkRateLimit, AI_GENERATE_LIMIT, AI_TRANSLATE_LIMIT, AI_SEARCH_LIMIT } from "@/lib/rate-limit";
import { z } from "zod";

// ── Groq client singleton ────────────────────────────────────────────────────

function getGroq(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

async function groqJSON<T>(
  groq: Groq,
  messages: Groq.Chat.ChatCompletionMessageParam[],
  maxTokens = 300
): Promise<T | null> {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
  });
  const text = res.choices[0]?.message?.content?.trim() ?? "";
  return JSON.parse(text) as T;
}

// ── Rate limit key helpers ───────────────────────────────────────────────────

async function getRateLimitKey(prefix: string): Promise<string> {
  try {
    const { user } = await requireAuth();
    return `${prefix}:user:${user.id}`;
  } catch {
    // Itilizatè pa konekte — limit pa IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    return `${prefix}:ip:${ip}`;
  }
}

// ── Input schemas (internal) ─────────────────────────────────────────────────

const GenerateSchema = z.object({
  property_type:  z.string().min(1).max(50),
  listing_type:   z.string().min(1).max(20),
  commune:        z.string().min(1).max(100),
  neighborhood:   z.string().max(100).default(""),
  bedrooms:       z.number().int().min(0).max(20),
  bathrooms:      z.number().int().min(0).max(20),
  area_sqm:       z.string().max(10).default(""),
  is_furnished:   z.boolean(),
  has_water:      z.boolean(),
  has_electricity:z.boolean(),
  has_generator:  z.boolean(),
  has_parking:    z.boolean(),
  has_internet:   z.boolean(),
});

const EstimateSchema = z.object({
  property_type: z.string().min(1).max(50),
  listing_type:  z.string().min(1).max(20),
  commune:       z.string().min(1).max(100),
  bedrooms:      z.number().int().min(0).max(20),
  bathrooms:     z.number().int().min(0).max(20),
  is_furnished:  z.boolean(),
  area_sqm:      z.string().max(10).default(""),
  currency:      z.enum(["HTG", "USD"]),
});

// ── Generate Listing Content ─────────────────────────────────────────────────

export async function generateListingContent(
  rawInput: unknown
): Promise<{ title?: string; description?: string; error?: string }> {
  // Validate input
  const parsed = GenerateSchema.safeParse(rawInput);
  if (!parsed.success) return { error: "Done envalid." };
  const data = parsed.data;

  // Rate limit
  const key = await getRateLimitKey("ai:generate");
  const rl = checkRateLimit(key, AI_GENERATE_LIMIT);
  if (!rl.allowed) return { error: "Ou itilize AI twòp. Eseye nan kèk minit." };

  const groq = getGroq();
  if (!groq) return { error: "AI pa disponib." };

  const typeLabels: Record<string, string> = {
    studio: "Studio", chambrette: "Chanbrèt", appartement: "Apatman",
    maison: "Mezon", villa: "Villa", te: "Terin", local: "Lokal Komèsyal",
    kay_2_chanm: "Kay 2 Chanm", kay_3_chanm: "Kay 3 Chanm",
    kay_4_chanm: "Kay 4 Chanm", autre: "Lòt",
  };
  const listingLabels: Record<string, string> = {
    rent: "pou lwaye", sale: "pou vann", both: "pou lwaye oswa vann",
  };
  const amenities = [
    data.has_water && "dlo kouran",
    data.has_electricity && "elektrisite",
    data.has_generator && "jenerate",
    data.has_internet && "Wi-Fi",
    data.has_parking && "garaj",
    data.is_furnished && "mèble",
  ].filter(Boolean).join(", ");

  const location = data.neighborhood
    ? `${data.neighborhood}, ${data.commune}`
    : data.commune;

  try {
    const result = await groqJSON<{ title?: string; description?: string }>(groq, [
      {
        role: "system",
        content: 'Ou se yon asistan ki retounen SÈLMAN du JSON brut. Fòma: {"title":"...","description":"..."}',
      },
      {
        role: "user",
        content: `Ekri yon TIT (maks 80 karaktè) ak yon DESKRIPSYON (150-300 karaktè) an Kreyòl ayisyen pou:
- Tip: ${typeLabels[data.property_type] ?? data.property_type} ${listingLabels[data.listing_type] ?? ""}
- Lokasyon: ${location}
- Chanm: ${data.bedrooms} | Saldeben: ${data.bathrooms}${data.area_sqm ? `\n- Sipèfisi: ${data.area_sqm} m²` : ""}
- Sèvis: ${amenities || "pa presize"}`,
      },
    ], 300);

    if (!result?.title || !result?.description) {
      return { error: "AI pa bay repons konplè. Eseye ankò." };
    }
    return { title: result.title, description: result.description };
  } catch {
    return { error: "Erè koneksyon AI. Eseye ankò." };
  }
}

// ── Estimate Price ───────────────────────────────────────────────────────────

export async function estimatePrice(
  rawInput: unknown
): Promise<{ price_monthly?: number; price_sale?: number; reasoning?: string; error?: string }> {
  const parsed = EstimateSchema.safeParse(rawInput);
  if (!parsed.success) return { error: "Done envalid." };
  const data = parsed.data;

  const key = await getRateLimitKey("ai:estimate");
  const rl = checkRateLimit(key, AI_GENERATE_LIMIT);
  if (!rl.allowed) return { error: "Ou itilize AI twòp. Eseye nan kèk minit." };

  const groq = getGroq();
  if (!groq) return { error: "AI pa disponib." };

  try {
    const result = await groqJSON<{
      price_monthly?: number; price_sale?: number; reasoning?: string;
    }>(groq, [
      { role: "system", content: "Ou retounen SÈLMAN JSON brut san markdown." },
      {
        role: "user",
        content: `Estime pri rezonab pou pwopriyete Ayiti sa a (${data.currency}):
- Tip: ${data.property_type} | ${data.listing_type}
- Komin: ${data.commune}
- Chanm: ${data.bedrooms} | Saldeben: ${data.bathrooms}${data.area_sqm ? `\n- Sipèfisi: ${data.area_sqm} m²` : ""}
- Mèble: ${data.is_furnished ? "Wi" : "Non"}
Retounen: {"price_monthly": number|0, "price_sale": number|0, "reasoning": "kout"}`,
      },
    ], 150);

    return {
      price_monthly: result?.price_monthly || undefined,
      price_sale:    result?.price_sale    || undefined,
      reasoning:     result?.reasoning,
    };
  } catch {
    return { error: "Erè AI. Eseye ankò." };
  }
}

// ── Natural Language Search ──────────────────────────────────────────────────

export async function parseNaturalSearch(query: string): Promise<{
  commune?: string; property_type?: string; listing_type?: string;
  bedrooms?: number; q?: string; error?: string;
}> {
  const q = z.string().min(1).max(200).safeParse(query);
  if (!q.success) return { q: query };

  const key = await getRateLimitKey("ai:search");
  const rl = checkRateLimit(key, AI_SEARCH_LIMIT);
  if (!rl.allowed) return { q: query }; // Fallback silansye — pa montre erè pou rechèch

  const groq = getGroq();
  if (!groq) return { q: query };

  try {
    const result = await groqJSON<{
      commune?: string | null; property_type?: string | null;
      listing_type?: string | null; bedrooms?: number | null; q?: string | null;
    }>(groq, [
      { role: "system", content: "Ou retounen SÈLMAN JSON brut san markdown." },
      {
        role: "user",
        content: `Analiz rechèch imobilye ayisyen: "${q.data}"
Ekstrè: commune (Okay/Jakmèl/Port-Salut/Jeremi/elatriye), property_type (studio/chambrette/appartement/villa/te/local), listing_type (rent/sale/both), bedrooms (1-6), q (mo kle rete).
Retounen: {"commune":null,"property_type":null,"listing_type":null,"bedrooms":null,"q":null}`,
      },
    ], 100);

    return {
      commune:       result?.commune       ?? undefined,
      property_type: result?.property_type ?? undefined,
      listing_type:  result?.listing_type  ?? undefined,
      bedrooms:      result?.bedrooms      ?? undefined,
      q:             result?.q             ?? undefined,
    };
  } catch {
    return { q: query };
  }
}

// ── Translate Listing ────────────────────────────────────────────────────────

export async function translateListing(
  title: string,
  description: string,
  lang: "fr" | "en"
): Promise<{ title?: string; description?: string; error?: string }> {
  // Validate
  const v = z.object({
    title:       z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    lang:        z.enum(["fr", "en"]),
  }).safeParse({ title, description, lang });
  if (!v.success) return { error: "Done envalid." };

  const key = await getRateLimitKey("ai:translate");
  const rl = checkRateLimit(key, AI_TRANSLATE_LIMIT);
  if (!rl.allowed) return { error: "Ou tradui twòp. Eseye nan kèk minit." };

  const groq = getGroq();
  if (!groq) return { error: "AI pa disponib." };

  const langLabel = lang === "fr" ? "français" : "English";

  try {
    const result = await groqJSON<{ title?: string; description?: string }>(groq, [
      {
        role: "system",
        content: `Ou tradui anons imobilye ayisyen an ${langLabel}. Retounen SÈLMAN JSON: {"title":"...","description":"..."}`,
      },
      {
        role: "user",
        content: `Tradui:\nTit: ${v.data.title}\nDeskripsyon: ${v.data.description}`,
      },
    ], 300);

    if (!result?.title || !result?.description) return { error: "Erè tradiksyon." };
    return { title: result.title, description: result.description };
  } catch {
    return { error: "Erè tradiksyon." };
  }
}
