-- Execute ONCE after 01_schema_and_security.sql in the existing Supabase SQL Editor.
-- Safely reorders ALL categories in one transaction, without exposing ordering writes to visitors.
create or replace function public.reorder_menu_categories(p_ordered_ids text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  total integer;
  requested integer;
begin
  if not public.is_restaurant_admin() then
    raise exception 'Admin access required' using errcode='42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(74620101);
  select count(*) into total from public.menu_categories;
  requested := coalesce(pg_catalog.array_length(p_ordered_ids, 1), 0);

  if requested <> total
     or (select count(distinct x.id) from pg_catalog.unnest(p_ordered_ids) as x(id)) <> total
     or exists (select 1 from public.menu_categories c where not (c.id = any(p_ordered_ids))) then
    raise exception 'The category list has changed. Refresh and retry.';
  end if;

  update public.menu_categories as c
     set sort_order = (r.ordinality - 1)::integer * 10
    from pg_catalog.unnest(p_ordered_ids) with ordinality as r(id, ordinality)
   where c.id = r.id;
end;
$$;

revoke all on function public.reorder_menu_categories(text[]) from public, anon;
grant execute on function public.reorder_menu_categories(text[]) to authenticated;
