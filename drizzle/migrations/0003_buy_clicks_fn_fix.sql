drop function if exists public.get_buy_clicks(integer);

create or replace function public.get_buy_clicks(p_limit integer default 500)
returns table (id uuid, event_name text, weplay_id text, url text, created_at timestamptz, metadata jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select e.id, e.event_name, e.weplay_id, e.url, e.created_at, e.metadata
  from public.analytics_events e
  where e.event_name in ('click_buy_now', 'payment_started', 'payment_verified', 'verification_started')
    and e.created_at > now() - interval '7 days'
  order by e.created_at desc
  limit greatest(coalesce(p_limit, 500), 1)
$$;

grant execute on function public.get_buy_clicks(integer) to anon, authenticated;
revoke execute on function public.get_buy_clicks(integer) from public;