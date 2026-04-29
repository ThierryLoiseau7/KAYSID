import type { Property, User } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "u-001",
    email: "jean.pierre@gmail.com",
    phone: "50936000001",
    full_name: "Jean-Pierre Baptiste",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    role: "agent",
    is_verified: true,
    is_premium: true,
    whatsapp: "50936000001",
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "u-002",
    email: "marie.claire@gmail.com",
    phone: "50937000002",
    full_name: "Marie Claire Joseph",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    role: "owner",
    is_verified: true,
    is_premium: false,
    whatsapp: "50937000002",
    created_at: "2024-02-10T09:00:00Z",
  },
  {
    id: "u-003",
    email: "robert.alexis@gmail.com",
    phone: "50938000003",
    full_name: "Robert Alexis",
    avatar_url: null,
    role: "agent",
    is_verified: true,
    is_premium: true,
    whatsapp: "50938000003",
    created_at: "2024-03-05T10:00:00Z",
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-001",
    owner_id: "u-001",
    location_id: 2,
    title: "Bèl Studio Mèble nan Fonfrè, Okay",
    description:
      "Studio trè pwòp nan yon zòn trankil nan Fonfrè. Li gen AC, dlo kouran, elektrisite EDH ak jenератè pou lannuit. Parfè pou yon pwofesyonèl oswa koup. Twalèt ak saldeben prive. Sekite 24/7.",
    property_type: "studio",
    price_monthly: 350,
    price_sale: null,
    listing_type: "rent",
    currency: "USD",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 35,
    is_furnished: true,
    has_water: true,
    has_electricity: true,
    has_generator: true,
    has_parking: false,
    has_internet: true,
    status: "active",
    is_featured: true,
    view_count: 142,
    contact_count: 18,
    address_text: "Ri Fonfrè, Okay",
    latitude: 18.5405,
    longitude: -73.3826,
    created_at: "2024-06-01T08:00:00Z",
    updated_at: "2024-06-01T08:00:00Z",
    location: { id: 2, department: "Sud", commune: "Okay", neighborhood: "Fonfrè" },
    photos: [
      { id: 1, property_id: "prop-001", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", is_cover: true, display_order: 0 },
      { id: 2, property_id: "prop-001", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", is_cover: false, display_order: 1 },
      { id: 3, property_id: "prop-001", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", is_cover: false, display_order: 2 },
    ],
    owner: MOCK_USERS[0],
  },
  {
    id: "prop-002",
    owner_id: "u-001",
    location_id: 9,
    title: "Villa Rèv bò Lanmè Port-Salut",
    description:
      "Yon opòtinite ekstraòdinè! Villa 3 chanm ak vyou lanmè direkteman. Pisin prive, jaden fleri, ak gwo wout pou 2 machin. Ideyal pou vakans, Diaspora, oswa rezidans pèmanàn. Mèb de kalite, AC nan tout chanm.",
    property_type: "villa",
    price_monthly: 1200,
    price_sale: 280000,
    listing_type: "both",
    currency: "USD",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 180,
    is_furnished: true,
    has_water: true,
    has_electricity: true,
    has_generator: true,
    has_parking: true,
    has_internet: true,
    status: "active",
    is_featured: true,
    view_count: 389,
    contact_count: 47,
    address_text: "Bò Lanmè, Port-Salut",
    latitude: 18.0993,
    longitude: -73.9232,
    created_at: "2024-05-15T10:00:00Z",
    updated_at: "2024-05-15T10:00:00Z",
    location: { id: 9, department: "Sud", commune: "Port-Salut", neighborhood: "Bò Lanmè" },
    photos: [
      { id: 4, property_id: "prop-002", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", is_cover: true, display_order: 0 },
      { id: 5, property_id: "prop-002", url: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", is_cover: false, display_order: 1 },
      { id: 6, property_id: "prop-002", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", is_cover: false, display_order: 2 },
    ],
    owner: MOCK_USERS[0],
  },
  {
    id: "prop-003",
    owner_id: "u-002",
    location_id: 3,
    title: "Chanbrèt Pwòp nan Latiboliè pou Etidyan",
    description:
      "Chanbrèt pou yon moun. Dlo, kouran, saldeben pataje ak 2 lòt locatè sèlman. Twa minit mache depi Inivèsite d'État. Kite yo sèlman si ou itilize li pou etid.",
    property_type: "chambrette",
    price_monthly: 5500,
    price_sale: null,
    listing_type: "rent",
    currency: "HTG",
    bedrooms: 1,
    bathrooms: 0,
    area_sqm: 15,
    is_furnished: true,
    has_water: true,
    has_electricity: true,
    has_generator: false,
    has_parking: false,
    has_internet: false,
    status: "active",
    is_featured: false,
    view_count: 67,
    contact_count: 9,
    address_text: "Ri Latiboliè, Okay",
    latitude: 18.5450,
    longitude: -73.3780,
    created_at: "2024-06-10T08:00:00Z",
    updated_at: "2024-06-10T08:00:00Z",
    location: { id: 3, department: "Sud", commune: "Okay", neighborhood: "Latiboliè" },
    photos: [
      { id: 7, property_id: "prop-003", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", is_cover: true, display_order: 0 },
    ],
    owner: MOCK_USERS[1],
  },
  {
    id: "prop-004",
    owner_id: "u-003",
    location_id: 19,
    title: "Bèl Apatman 2 Chanm nan Bèlans, Jakmèl",
    description:
      "Apatman spacye ak balkon ki ba ou vyou sou Jakmèl. Yon chanm mèt, yon chanm envite, kizin ekipe, salon klimatize. Tou pre plaj Jakmèl, mache lokal, ak sant vil. Kontra minimòm 6 mwa.",
    property_type: "kay_2_chanm",
    price_monthly: 450,
    price_sale: null,
    listing_type: "rent",
    currency: "USD",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 75,
    is_furnished: true,
    has_water: true,
    has_electricity: true,
    has_generator: false,
    has_parking: true,
    has_internet: true,
    status: "active",
    is_featured: true,
    view_count: 203,
    contact_count: 31,
    address_text: "Bèlans, Jakmèl",
    latitude: 18.2316,
    longitude: -72.5356,
    created_at: "2024-05-28T09:00:00Z",
    updated_at: "2024-05-28T09:00:00Z",
    location: { id: 19, department: "Sud-Est", commune: "Jakmèl", neighborhood: "Bèlans" },
    photos: [
      { id: 8, property_id: "prop-004", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", is_cover: true, display_order: 0 },
      { id: 9, property_id: "prop-004", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", is_cover: false, display_order: 1 },
    ],
    owner: MOCK_USERS[2],
  },
  {
    id: "prop-005",
    owner_id: "u-001",
    location_id: 25,
    title: "Studio Abòdab pou Lwaye nan Jeremi",
    description:
      "Studio nèf ki fèk fini konstwi. Pwòp, klè, ak bon vantilasyon. Dlo Camep, kouran EDH ak jenerate. Saldeben ak twalèt prive. Nan yon zòn trankil Jeremi.",
    property_type: "studio",
    price_monthly: 250,
    price_sale: null,
    listing_type: "rent",
    currency: "USD",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 30,
    is_furnished: false,
    has_water: true,
    has_electricity: true,
    has_generator: true,
    has_parking: false,
    has_internet: false,
    status: "active",
    is_featured: false,
    view_count: 88,
    contact_count: 12,
    address_text: "Vil Jeremi",
    latitude: 18.6449,
    longitude: -74.1151,
    created_at: "2024-06-05T11:00:00Z",
    updated_at: "2024-06-05T11:00:00Z",
    location: { id: 25, department: "Grand Anz", commune: "Jeremi", neighborhood: "Vil" },
    photos: [
      { id: 10, property_id: "prop-005", url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80", is_cover: true, display_order: 0 },
    ],
    owner: MOCK_USERS[0],
  },
  {
    id: "prop-006",
    owner_id: "u-002",
    location_id: 5,
    title: "Terin nan Kay Myèl, Okay pou Vann",
    description:
      "Terin plat, dokiman an règ, nan Kay Myèl. 500 mèt kare. Rezidansyèl ak komèsyal. Bon kote pou bati yon pwopriyete rezidansyèl. Tit disponib.",
    property_type: "te",
    price_monthly: null,
    price_sale: 45000,
    listing_type: "sale",
    currency: "USD",
    bedrooms: 0,
    bathrooms: 0,
    area_sqm: 500,
    is_furnished: false,
    has_water: false,
    has_electricity: false,
    has_generator: false,
    has_parking: false,
    has_internet: false,
    status: "active",
    is_featured: false,
    view_count: 156,
    contact_count: 22,
    address_text: "Kay Myèl, Okay",
    latitude: 18.5380,
    longitude: -73.3910,
    created_at: "2024-04-20T08:00:00Z",
    updated_at: "2024-04-20T08:00:00Z",
    location: { id: 5, department: "Sud", commune: "Okay", neighborhood: "Kay Myèl" },
    photos: [
      { id: 11, property_id: "prop-006", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", is_cover: true, display_order: 0 },
    ],
    owner: MOCK_USERS[1],
  },
  {
    id: "prop-007",
    owner_id: "u-003",
    location_id: 4,
    title: "Kay 3 Chanm Modèn nan Vil Okay",
    description:
      "Kay 3 chanm nan kè Okay. Gwo salon, kizin ekipe, 2 saldeben. Jaden dèyè kay pou timoun yo jwe. Garaj pou 1 machin. Vwazenaj sekirize ak bon."
      ,
    property_type: "kay_3_chanm",
    price_monthly: 700,
    price_sale: null,
    listing_type: "rent",
    currency: "USD",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    is_furnished: false,
    has_water: true,
    has_electricity: true,
    has_generator: false,
    has_parking: true,
    has_internet: false,
    status: "active",
    is_featured: false,
    view_count: 211,
    contact_count: 28,
    address_text: "Vil Okay",
    latitude: 18.5420,
    longitude: -73.3850,
    created_at: "2024-05-10T07:00:00Z",
    updated_at: "2024-05-10T07:00:00Z",
    location: { id: 4, department: "Sud", commune: "Okay", neighborhood: "Vil" },
    photos: [
      { id: 12, property_id: "prop-007", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", is_cover: true, display_order: 0 },
      { id: 13, property_id: "prop-007", url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e97?w=800&q=80", is_cover: false, display_order: 1 },
    ],
    owner: MOCK_USERS[2],
  },
  {
    id: "prop-008",
    owner_id: "u-001",
    location_id: 20,
    title: "Studio Bèl nan Fond Kabès, Jakmèl",
    description:
      "Studio mèble tèt chaje nan Fond Kabès. Sèvis dlo, kouran, Wi-Fi entènèt haut débit. Kwinn saldeben modèn. Bèl vyou sou mòn Jakmèl. Trankil ak sekirize.",
    property_type: "studio",
    price_monthly: 300,
    price_sale: null,
    listing_type: "rent",
    currency: "USD",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 28,
    is_furnished: true,
    has_water: true,
    has_electricity: true,
    has_generator: false,
    has_parking: false,
    has_internet: true,
    status: "active",
    is_featured: false,
    view_count: 94,
    contact_count: 13,
    address_text: "Fond Kabès, Jakmèl",
    latitude: 18.2340,
    longitude: -72.5380,
    created_at: "2024-06-12T06:00:00Z",
    updated_at: "2024-06-12T06:00:00Z",
    location: { id: 20, department: "Sud-Est", commune: "Jakmèl", neighborhood: "Fond Kabès" },
    photos: [
      { id: 14, property_id: "prop-008", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80", is_cover: true, display_order: 0 },
    ],
    owner: MOCK_USERS[0],
  },
];

export function getMockProperties(filters?: {
  commune?: string;
  neighborhood?: string;
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  q?: string;
}): Property[] {
  let results = [...MOCK_PROPERTIES];

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.location?.commune?.toLowerCase().includes(q) ||
        p.location?.neighborhood?.toLowerCase().includes(q)
    );
  }

  if (filters?.commune) {
    results = results.filter((p) => p.location?.commune === filters.commune);
  }
  if (filters?.neighborhood) {
    results = results.filter((p) => p.location?.neighborhood === filters.neighborhood);
  }
  if (filters?.property_type) {
    results = results.filter((p) => p.property_type === filters.property_type);
  }
  if (filters?.listing_type) {
    results = results.filter((p) =>
      p.listing_type === filters.listing_type || p.listing_type === "both"
    );
  }
  if (filters?.min_price !== undefined && filters.min_price > 0) {
    results = results.filter((p) => {
      const price = p.price_monthly ?? p.price_sale ?? 0;
      return price >= (filters.min_price ?? 0);
    });
  }
  if (filters?.max_price !== undefined && filters.max_price < 999999) {
    results = results.filter((p) => {
      const price = p.price_monthly ?? p.price_sale ?? 0;
      return price <= (filters.max_price ?? 999999);
    });
  }
  if (filters?.bedrooms !== undefined && filters.bedrooms > 0) {
    results = results.filter((p) => p.bedrooms >= (filters.bedrooms ?? 0));
  }

  return results;
}

export function getMockPropertyById(id: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.id === id);
}
