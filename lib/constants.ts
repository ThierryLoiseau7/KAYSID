import type { PropertyType, ListingType, Currency } from "@/types";

export const LOCATIONS = [
  { department: "Sud",      commune: "Okay",             neighborhood: null },
  { department: "Sud",      commune: "Okay",             neighborhood: "Fonfrè" },
  { department: "Sud",      commune: "Okay",             neighborhood: "Latiboliè" },
  { department: "Sud",      commune: "Okay",             neighborhood: "Vil" },
  { department: "Sud",      commune: "Okay",             neighborhood: "Kay Myèl" },
  { department: "Sud",      commune: "Okay",             neighborhood: "Bòs Casimir" },
  { department: "Sud",      commune: "Okay",             neighborhood: "Nan Flèch" },
  { department: "Sud",      commune: "Port-Salut",       neighborhood: null },
  { department: "Sud",      commune: "Port-Salut",       neighborhood: "Sant Vil" },
  { department: "Sud",      commune: "Port-Salut",       neighborhood: "Bò Lanmè" },
  { department: "Sud",      commune: "Sen Lwi du Sid",   neighborhood: null },
  { department: "Sud",      commune: "Sen Lwi du Sid",   neighborhood: "Vil" },
  { department: "Sud",      commune: "Torbèk",           neighborhood: null },
  { department: "Sud",      commune: "Chardonnières",    neighborhood: null },
  { department: "Sud",      commune: "Cavaillon",        neighborhood: null },
  { department: "Sud",      commune: "Akòy",             neighborhood: null },
  { department: "Sud",      commune: "Tiburon",          neighborhood: null },
  { department: "Sud-Est",  commune: "Jakmèl",           neighborhood: null },
  { department: "Sud-Est",  commune: "Jakmèl",           neighborhood: "Fond Kabès" },
  { department: "Sud-Est",  commune: "Jakmèl",           neighborhood: "Bèlans" },
  { department: "Sud-Est",  commune: "Jakmèl",           neighborhood: "La Gossline" },
  { department: "Sud-Est",  commune: "Jakmèl",           neighborhood: "Gwo Mòn" },
  { department: "Sud-Est",  commune: "Bèlans",           neighborhood: null },
  { department: "Sud-Est",  commune: "Mori",             neighborhood: null },
  { department: "Nippes",   commune: "Jeremi",           neighborhood: null },
  { department: "Nippes",   commune: "Jeremi",           neighborhood: "Vil" },
  { department: "Nippes",   commune: "Jeremi",           neighborhood: "Baradè" },
  { department: "Nippes",   commune: "Miragoàn",         neighborhood: null },
  { department: "Nippes",   commune: "Miragoàn",         neighborhood: "Vil" },
  { department: "Nippes",   commune: "Anse-à-Veau",      neighborhood: null },
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
  `Bonjou! Mwen wè anons ou sou KaySid pou "${title}" (Ref: ${ref}). Eske li toujou disponib?`;
