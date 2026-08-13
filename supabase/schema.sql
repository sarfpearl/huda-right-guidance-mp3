-- ============================================================================
--  Huda Bayan : Supabase schema
--  Run in the Supabase SQL editor (or via the CLI) to provision the database.
--  Includes tables, indexes, Row Level Security, a play-count RPC, and the
--  storage buckets for audio & images.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── admins ──────────────────────────────────────────────────────────────────
-- Membership table gating all write access. Add a row (user_id from auth.users)
-- to grant admin rights.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ── categories ────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ta text,
  slug text not null unique,
  description text default '',
  icon text default 'mic',
  cover_image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── speakers ──────────────────────────────────────────────────────────────
create table if not exists public.speakers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text default '',
  profile_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── bayan ────────────────────────────────────────────────────────────────
create table if not exists public.bayan (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  speaker_id uuid references public.speakers (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  language text not null default 'Tamil',
  cover_image_url text,
  audio_source text not null default 'local' check (audio_source in ('local', 'youtube')),
  audio_url text,
  youtube_video_id text,
  duration_seconds int not null default 0,
  published_at timestamptz,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  play_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Guarantee a playable source matches the declared type.
  constraint bayan_source_valid check (
    (audio_source = 'local'   and audio_url is not null) or
    (audio_source = 'youtube' and youtube_video_id is not null)
  )
);

create index if not exists bayan_category_idx on public.bayan (category_id);
create index if not exists bayan_speaker_idx on public.bayan (speaker_id);
create index if not exists bayan_published_idx on public.bayan (is_published, published_at desc);
create index if not exists bayan_popular_idx on public.bayan (is_published, play_count desc);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists bayan_touch_updated on public.bayan;
create trigger bayan_touch_updated
  before update on public.bayan
  for each row execute function public.touch_updated_at();

-- ── bayan_plays (anonymous analytics) ───────────────────────────────────────
create table if not exists public.bayan_plays (
  id uuid primary key default gen_random_uuid(),
  bayan_id uuid references public.bayan (id) on delete cascade,
  session_id text not null,
  started_at timestamptz not null default now(),
  completed boolean not null default false,
  duration_listened int not null default 0
);
create index if not exists bayan_plays_bayan_idx on public.bayan_plays (bayan_id);

-- Atomic play-count increment (called from the client on playback start).
create or replace function public.increment_play_count(bayan_id uuid, session text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bayan set play_count = play_count + 1 where id = bayan_id;
  insert into public.bayan_plays (bayan_id, session_id) values (bayan_id, session);
end;
$$;

-- ============================================================================
--  ROW LEVEL SECURITY
--  Public: read published bayan / active categories / active speakers.
--  Admins (public.admins): full write access.
-- ============================================================================
alter table public.categories  enable row level security;
alter table public.speakers    enable row level security;
alter table public.bayan       enable row level security;
alter table public.bayan_plays enable row level security;
alter table public.admins      enable row level security;

-- categories
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories
  for select using (is_active or public.is_admin());
drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- speakers
drop policy if exists speakers_read on public.speakers;
create policy speakers_read on public.speakers
  for select using (is_active or public.is_admin());
drop policy if exists speakers_write on public.speakers;
create policy speakers_write on public.speakers
  for all using (public.is_admin()) with check (public.is_admin());

-- bayan
drop policy if exists bayan_read on public.bayan;
create policy bayan_read on public.bayan
  for select using (is_published or public.is_admin());
drop policy if exists bayan_write on public.bayan;
create policy bayan_write on public.bayan
  for all using (public.is_admin()) with check (public.is_admin());

-- bayan_plays: anyone can insert (anonymous), only admins can read.
drop policy if exists bayan_plays_insert on public.bayan_plays;
create policy bayan_plays_insert on public.bayan_plays
  for insert with check (true);
drop policy if exists bayan_plays_read on public.bayan_plays;
create policy bayan_plays_read on public.bayan_plays
  for select using (public.is_admin());

-- admins: only admins can see the list.
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins
  for select using (public.is_admin());

-- ============================================================================
--  STORAGE BUCKETS
--  bayan-audio  : MP3 files (public read)
--  bayan-images : cover art  (public read)
--  speaker-images : profile images (public read)
--  Writes restricted to admins.
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('bayan-audio', 'bayan-audio', true),
  ('bayan-images', 'bayan-images', true),
  ('speaker-images', 'speaker-images', true)
on conflict (id) do nothing;

drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects
  for select using (bucket_id in ('bayan-audio', 'bayan-images', 'speaker-images'));

drop policy if exists storage_admin_write on storage.objects;
create policy storage_admin_write on storage.objects
  for all
  using (bucket_id in ('bayan-audio', 'bayan-images', 'speaker-images') and public.is_admin())
  with check (bucket_id in ('bayan-audio', 'bayan-images', 'speaker-images') and public.is_admin());
