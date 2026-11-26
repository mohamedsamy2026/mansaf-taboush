-- Execute FIRST in Supabase SQL Editor. Do not add any passwords here.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create or replace function public.is_restaurant_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())); $$;
revoke all on function public.is_restaurant_admin() from public, anon;
grant execute on function public.is_restaurant_admin() to authenticated;
create table if not exists public.menu_categories (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  name_ar text not null check (length(btrim(name_ar)) between 1 and 120),
  name_en text not null default '',
  sort_order int not null default 0
);
create table if not exists public.menu_products (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  category_id text not null references public.menu_categories(id) on delete cascade,
  name_ar text not null check (length(btrim(name_ar)) between 1 and 160),
  name_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  image_url text not null default '/images/products/mansaf-plate.jpg',
  featured boolean not null default false,
  price numeric(12,2) check (price >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.product_sizes (
  id text not null check (id ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  product_id text not null references public.menu_products(id) on delete cascade,
  label_ar text not null check (length(btrim(label_ar)) between 1 and 80),
  label_en text not null default '',
  price numeric(12,2) not null check (price >= 0),
  sort_order int not null default 0,
  primary key (product_id,id)
);
create table if not exists public.restaurant_settings (
  id integer primary key default 1 check (id = 1),
  phone_country_code text not null default '+966' check (phone_country_code ~ '^\+[0-9]{1,4}$'),
  phone_local text not null default '531562040' check (phone_local ~ '^[0-9]{6,15}$'),
  whatsapp_country_code text not null default '+966' check (whatsapp_country_code ~ '^\+[0-9]{1,4}$'),
  whatsapp_local text not null default '531562040' check (whatsapp_local ~ '^[0-9]{6,15}$'),
  social_handle text not null default '@MansafTaboush',
  show_social_handle boolean not null default true,
  logo_url text not null default '/images/brand/logo-transparent.png',
  hero_product_id text,
  currency_ar text not null default 'ر.س',
  currency_en text not null default 'SAR',
  delivery_fee numeric(12,2) check (delivery_fee >= 0),
  updated_at timestamptz not null default now()
);
create table if not exists public.social_links (
  platform text primary key check (platform in ('youtube','instagram','tiktok','x','facebook','snapchat','telegram')),
  url text not null check (url ~* '^https://[^[:space:]]+$')
);
create index if not exists idx_products_category on public.menu_products(category_id, sort_order);
create index if not exists idx_sizes_product on public.product_sizes(product_id, sort_order);

alter table public.admin_users enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.social_links enable row level security;

-- API access is explicit even if "grant new tables automatically" was disabled.
grant usage on schema public to anon, authenticated;
grant select on public.menu_categories,public.menu_products,public.product_sizes,public.restaurant_settings,public.social_links to anon,authenticated;
grant insert,update,delete on public.menu_categories,public.menu_products,public.product_sizes,public.restaurant_settings,public.social_links to authenticated;
grant select on public.admin_users to authenticated;
revoke all on public.admin_users from anon;

drop policy if exists admin_self on public.admin_users;
create policy admin_self on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

-- Separate operation policies, every mutation requires admin role. No visitor writes.
do $$ declare tab text; begin
  foreach tab in array array['menu_categories','menu_products','product_sizes','restaurant_settings','social_links'] loop
    execute format('drop policy if exists public_read on public.%I',tab);
    execute format('drop policy if exists admin_insert on public.%I',tab);
    execute format('drop policy if exists admin_update on public.%I',tab);
    execute format('drop policy if exists admin_delete on public.%I',tab);
    execute format('create policy public_read on public.%I for select to anon,authenticated using (true)',tab);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select public.is_restaurant_admin()))',tab);
    execute format('create policy admin_update on public.%I for update to authenticated using ((select public.is_restaurant_admin())) with check ((select public.is_restaurant_admin()))',tab);
    execute format('create policy admin_delete on public.%I for delete to authenticated using ((select public.is_restaurant_admin()))',tab);
  end loop;
end $$;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('restaurant-media','restaurant-media',true,2097152,array['image/webp','image/jpeg','image/png'])
on conflict (id) do update set public=true,file_size_limit=2097152,allowed_mime_types=array['image/webp','image/jpeg','image/png'];

-- Storage policies only let admin write, and limit paths to products/ and brand/.
drop policy if exists restaurant_media_select on storage.objects;
create policy restaurant_media_select on storage.objects for select to authenticated
using (bucket_id='restaurant-media' and (select public.is_restaurant_admin()));
drop policy if exists restaurant_media_insert on storage.objects;
drop policy if exists restaurant_media_update on storage.objects;
drop policy if exists restaurant_media_delete on storage.objects;
create policy restaurant_media_insert on storage.objects for insert to authenticated
with check (bucket_id='restaurant-media' and (storage.foldername(name))[1] in ('products','brand') and (select public.is_restaurant_admin()));
create policy restaurant_media_update on storage.objects for update to authenticated
using (bucket_id='restaurant-media' and (select public.is_restaurant_admin()))
with check (bucket_id='restaurant-media' and (storage.foldername(name))[1] in ('products','brand') and (select public.is_restaurant_admin()));
create policy restaurant_media_delete on storage.objects for delete to authenticated
using (bucket_id='restaurant-media' and (select public.is_restaurant_admin()));
-- Public bucket objects are downloadable by public URLs; no public uploads.
