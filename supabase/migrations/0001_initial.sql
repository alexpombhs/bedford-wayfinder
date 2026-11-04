-- Run in a Supabase project. Enable PostGIS in a separate schema to avoid putting extension objects in public.
create extension if not exists postgis with schema extensions;
create table if not exists public.historical_sites (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  source_url text, image_url text, audio_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists historical_sites_published_idx on public.historical_sites(published);
create index if not exists historical_sites_geography_idx on public.historical_sites using gist ((extensions.st_setsrid(extensions.st_makepoint(longitude,latitude),4326)::extensions.geography));
create table if not exists public.tours (id uuid primary key default gen_random_uuid(), name text not null, description text, travel_mode text not null check (travel_mode in ('walking','cycling','driving')), published boolean not null default false);
create table if not exists public.tour_stops (tour_id uuid not null references public.tours(id) on delete cascade, site_id uuid not null references public.historical_sites(id) on delete cascade, stop_order integer not null check (stop_order >= 0), primary key(tour_id,site_id),unique(tour_id,stop_order));
alter table public.historical_sites enable row level security;
alter table public.tours enable row level security;
alter table public.tour_stops enable row level security;
create policy "Anyone can read published sites" on public.historical_sites for select using (published = true);
create policy "Anyone can read published tours" on public.tours for select using (published = true);
create policy "Anyone can read stops of published tours" on public.tour_stops for select using (exists (select 1 from public.tours where id = tour_id and published = true) and exists (select 1 from public.historical_sites where id = site_id and published = true));
-- Writes are intentionally unavailable to public clients; use an authenticated administrative service with explicit permissions.
