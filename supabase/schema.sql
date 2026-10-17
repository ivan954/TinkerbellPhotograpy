-- Tinkerbell Studio: content and images managed from the /admin screen.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run again.

-- One row per page/document (e.g. "home", "contact", "prices/newborn").
-- The site falls back to its bundled JSON for any document that has no row.
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null
);

-- Users allowed to edit the site. Signing up is not enough: a user must be listed here.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Explicit API access, so this works even when "Automatically expose new
-- tables" is off. What each role may actually do is limited by the policies below.
grant usage on schema public to anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant select on public.admins to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before insert or update on public.site_content
  for each row execute function public.touch_updated_at();

alter table public.site_content enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins can add site content" on public.site_content;
create policy "Admins can add site content"
  on public.site_content for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can change site content" on public.site_content;
create policy "Admins can change site content"
  on public.site_content for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
  on public.site_content for delete to authenticated
  using (public.is_admin());

-- Lets the admin screen check whether the signed-in user is an admin.
drop policy if exists "Users can see their own admin row" on public.admins;
create policy "Users can see their own admin row"
  on public.admins for select to authenticated
  using (user_id = auth.uid());

-- Public bucket for uploaded photos: anyone can view, only admins can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins can change site images" on storage.objects;
create policy "Admins can change site images"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- After creating your user (Authentication -> Users -> Add user), make it an admin:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR-EMAIL@example.com';
