import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { HistoricalSite, seedSites } from '../data/sites';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export async function loadSites(): Promise<HistoricalSite[]> {
  if (!client) return seedSites;
  const { data, error } = await client.from('historical_sites').select('id,name,description,latitude,longitude,source_url').eq('published', true).order('name');
  if (error) throw error;
  return (data ?? []).map((site) => ({ id: site.id, name: site.name, description: site.description, latitude: site.latitude, longitude: site.longitude, sourceUrl: site.source_url ?? undefined }));
}
