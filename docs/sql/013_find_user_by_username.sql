create or replace function public.find_user_by_username(p_username text)
returns table (id uuid, username text, display_name text, avatar_url text)
language sql
security definer
as $$
  select id, username, display_name, avatar_url
  from public.profiles
  where lower(username) = lower(p_username)
  limit 1;
$$;

revoke all on function public.find_user_by_username(text) from public;
grant execute on function public.find_user_by_username(text) to authenticated;
