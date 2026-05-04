import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from './server';
import { createAdminClient } from './admin';
import { logger } from '@/lib/logger';
import type { Property, PropertyType, ListingType } from '@/types';

/**
 * Cookie-free anon client — safe inside unstable_cache.
 * Only for public data (status='active' properties via RLS).
 */
function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface PropertyFilters {
  commune?: string;
  neighborhood?: string;
  property_type?: PropertyType | string;
  listing_type?: ListingType | string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  q?: string;
}

export const PROPERTY_SELECT = `
  *,
  location:locations(*),
  photos:property_photos(id, url, is_cover, display_order),
  owner:profiles!owner_id(id, full_name, avatar_url, role, is_verified, whatsapp)
`;

// Helper: kreye client san kraze si env vars manke
async function getClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getProperties(
  filters?: PropertyFilters,
  page = 1,
  perPage = 15
): Promise<{ data: Property[]; count: number }> {
  const supabase = await getClient();
  if (!supabase) return { data: [], count: 0 };

  // Filtre pa komin/katye via location_id
  let locationIds: number[] | null = null;
  if (filters?.commune) {
    let locQuery = supabase.from('locations').select('id').eq('commune', filters.commune);
    if (filters.neighborhood) locQuery = locQuery.eq('neighborhood', filters.neighborhood);
    const { data: locs } = await locQuery;
    if (!locs?.length) return { data: [], count: 0 };
    locationIds = locs.map((l) => l.id);
  }

  let query = supabase
    .from('properties')
    .select(PROPERTY_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (locationIds) query = query.in('location_id', locationIds);
  if (filters?.property_type) query = query.eq('property_type', filters.property_type);
  if (filters?.listing_type) {
    query = query.or(`listing_type.eq.${filters.listing_type},listing_type.eq.both`);
  }
  if (filters?.min_price) {
    query = query.or(`price_monthly.gte.${filters.min_price},price_sale.gte.${filters.min_price}`);
  }
  if (filters?.max_price && filters.max_price < 999999) {
    query = query.or(`price_monthly.lte.${filters.max_price},price_sale.lte.${filters.max_price}`);
  }
  if (filters?.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
  if (filters?.q) {
    // Sanitize: retire karaktè espesyal PostgREST, limite longè
    const safeQ = filters.q.replace(/[%_(),]/g, " ").trim().slice(0, 100);
    if (safeQ) query = query.or(`title.ilike.%${safeQ}%,description.ilike.%${safeQ}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    logger.error('getProperties failed', { message: error.message });
    return { data: [], count: 0 };
  }
  return { data: (data as Property[]) ?? [], count: count ?? 0 };
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return unstable_cache(
    async () => {
      const supabase = createAnonClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('id', id)
        .single();

      if (error) return null;
      return data as Property;
    },
    [`property-${id}`],
    { revalidate: 30, tags: [`property-${id}`, 'properties'] }
  )();
}

export async function getSimilarProperties(propertyId: string, commune: string): Promise<Property[]> {
  return unstable_cache(
    async () => {
      const supabase = createAnonClient();
      if (!supabase) return [];

      const { data: locs } = await supabase.from('locations').select('id').eq('commune', commune);
      if (!locs?.length) return [];

      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('status', 'active')
        .in('location_id', locs.map((l) => l.id))
        .neq('id', propertyId)
        .limit(3);

      if (error) return [];
      return (data as Property[]) ?? [];
    },
    [`similar-${commune}-${propertyId}`],
    { revalidate: 120, tags: ['properties'] }
  )();
}

export async function getUserProperties(userId: string): Promise<Property[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_SELECT)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data as Property[]) ?? [];
}

export async function getPropertyForEdit(id: string, userId: string): Promise<Property | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('properties')
    .select(`*, location:locations(*)`)
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error) return null;
  return data as Property;
}

export async function getAdminProperties(status?: string): Promise<Property[]> {
  // Utilise service role pou bypasse RLS — admin wè tout pwopriyete
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from('properties')
      .select(PROPERTY_SELECT)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return [];
    return (data as Property[]) ?? [];
  } catch {
    return [];
  }
}

export const getRecentProperties = unstable_cache(
  async (limit: number = 8): Promise<Property[]> => {
    const supabase = createAnonClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('properties')
      .select(PROPERTY_SELECT)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data as Property[]) ?? [];
  },
  ['recent-properties'],
  { revalidate: 60, tags: ['properties'] }
);
