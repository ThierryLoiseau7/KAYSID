import type { PropertyType, ListingType, Currency } from "@/types";

export const LOCATIONS = [
  // ===================== SUD =====================
  { department: "Sud",       commune: "Okay",            neighborhood: null },
  { department: "Sud",       commune: "Okay",            neighborhood: "Fonfrè" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Latiboliè" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Vil" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Kay Myèl" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Bòs Casimir" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Nan Flèch" },
  { department: "Sud",       commune: "Okay",            neighborhood: "Rivyè Glase" },
  { department: "Sud",       commune: "Port-Salut",      neighborhood: null },
  { department: "Sud",       commune: "Port-Salut",      neighborhood: "Sant Vil" },
  { department: "Sud",       commune: "Port-Salut",      neighborhood: "Bò Lanmè" },
  { department: "Sud",       commune: "Sen Lwi du Sid",  neighborhood: null },
  { department: "Sud",       commune: "Sen Lwi du Sid",  neighborhood: "Vil" },
  { department: "Sud",       commune: "Torbèk",          neighborhood: null },
  { department: "Sud",       commune: "Chardonnières",   neighborhood: null },
  { department: "Sud",       commune: "Cavaillon",       neighborhood: null },
  { department: "Sud",       commune: "Akwè",            neighborhood: null },
  { department: "Sud",       commune: "Tiburon",         neighborhood: null },
  { department: "Sud",       commune: "Kan Perin",       neighborhood: null },
  { department: "Sud",       commune: "Manich",          neighborhood: null },
  { department: "Sud",       commune: "Koto",            neighborhood: null },
  { department: "Sud",       commune: "Sen Jan du Sid",  neighborhood: null },
  { department: "Sud",       commune: "Zannglè",         neighborhood: null },
  { department: "Sud",       commune: "Il a Vach",       neighborhood: null },
  { department: "Sud",       commune: "Anikyè",          neighborhood: null },
  { department: "Sud",       commune: "Roch a Bato",     neighborhood: null },
  { department: "Sud",       commune: "Pò-a-Piman",      neighborhood: null },
  // ===================== SUD-EST =====================
  { department: "Sud-Est",   commune: "Jakmèl",          neighborhood: null },
  { department: "Sud-Est",   commune: "Jakmèl",          neighborhood: "Fond Kabès" },
  { department: "Sud-Est",   commune: "Jakmèl",          neighborhood: "La Gossline" },
  { department: "Sud-Est",   commune: "Jakmèl",          neighborhood: "Gwo Mòn" },
  { department: "Sud-Est",   commune: "Jakmèl",          neighborhood: "Bèl Anz" },
  { department: "Sud-Est",   commune: "Kay Jakmèl",      neighborhood: null },
  { department: "Sud-Est",   commune: "La Vale",         neighborhood: null },
  { department: "Sud-Est",   commune: "Benet",           neighborhood: null },
  { department: "Sud-Est",   commune: "Bèl Anz",         neighborhood: null },
  { department: "Sud-Est",   commune: "Kot de Fè",       neighborhood: null },
  { department: "Sud-Est",   commune: "Tiòt",            neighborhood: null },
  { department: "Sud-Est",   commune: "Anz-a-Pit",       neighborhood: null },
  { department: "Sud-Est",   commune: "Gran Gozye",      neighborhood: null },
  { department: "Sud-Est",   commune: "Mori",            neighborhood: null },
  // ===================== NIPPES =====================
  { department: "Nippes",    commune: "Miragoàn",        neighborhood: null },
  { department: "Nippes",    commune: "Miragoàn",        neighborhood: "Vil" },
  { department: "Nippes",    commune: "Anz-a-Vo",        neighborhood: null },
  { department: "Nippes",    commune: "Pti Riv Nip",     neighborhood: null },
  { department: "Nippes",    commune: "Baradè",          neighborhood: null },
  { department: "Nippes",    commune: "Rano",            neighborhood: null },
  { department: "Nippes",    commune: "Plezans du Sid",  neighborhood: null },
  { department: "Nippes",    commune: "Fon Nèg",         neighborhood: null },
  { department: "Nippes",    commune: "Gran Boukan",     neighborhood: null },
  { department: "Nippes",    commune: "Payan",           neighborhood: null },
  { department: "Nippes",    commune: "Pti Trou Nip",    neighborhood: null },
  { department: "Nippes",    commune: "Lazil",           neighborhood: null },
  // ===================== GRAND ANZ =====================
  { department: "Grand Anz", commune: "Jeremi",          neighborhood: null },
  { department: "Grand Anz", commune: "Jeremi",          neighborhood: "Vil" },
  { department: "Grand Anz", commune: "Jeremi",          neighborhood: "Nan Sab" },
  { department: "Grand Anz", commune: "Jeremi",          neighborhood: "Bò Lanmè" },
  { department: "Grand Anz", commune: "Anz Eno",         neighborhood: null },
  { department: "Grand Anz", commune: "Dam Mari",        neighborhood: null },
  { department: "Grand Anz", commune: "Bonbon",          neighborhood: null },
  { department: "Grand Anz", commune: "Korày",           neighborhood: null },
  { department: "Grand Anz", commune: "Pestel",          neighborhood: null },
  { department: "Grand Anz", commune: "Moron",           neighborhood: null },
  { department: "Grand Anz", commune: "Bòmò",           neighborhood: null },
  { department: "Grand Anz", commune: "Rouzo",           neighborhood: null },
  { department: "Grand Anz", commune: "Abrikò",          neighborhood: null },
  { department: "Grand Anz", commune: "Irwa",            neighborhood: null },
  { department: "Grand Anz", commune: "Chanbelan",       neighborhood: null },
];

export const COMMUNES = [...new Set(LOCATIONS.map((l) => l.commune))];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  chambrette:   "Chanbrèt",
  studio:       "Studio",
  appartement:  "Apatman",
  kay_2_chanm:  "Kay 2 Chanm",
  kay_3_chanm:  "Kay 3 Chanm",
  kay_4_chanm:  "Kay 4 Chanm+",
  te:           "Tè / Terin",
  villa:        "Villa",
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  rent: "Pou Lwaye",
  sale: "Pou Vann",
  both: "Lwaye oswa Vann",
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  HTG: "HTG (Goud)",
  USD: "USD (Dola)",
};

export const PRICE_RANGES = [
  { label: "Tout Pri",          min: 0,      max: 999999 },
  { label: "Anba $100/mwa",     min: 0,      max: 100    },
  { label: "$100 – $300/mwa",   min: 100,    max: 300    },
  { label: "$300 – $600/mwa",   min: 300,    max: 600    },
  { label: "$600 – $1,000/mwa", min: 600,    max: 1000   },
  { label: "Anlè $1,000/mwa",   min: 1000,   max: 999999 },
];

export const WHATSAPP_MESSAGE_TEMPLATE = (title: string, ref: string) =>
  `Bonjou! Mwen wè anons ou sou PouPiyay pou "${title}" (Ref: ${ref}). Eske li toujou disponib?`;
