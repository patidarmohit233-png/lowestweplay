create or replace function public.get_recent_analytics(p_limit integer default 500)
returns table (id uuid, weplay_id text, url text, created_at timestamptz, metadata jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select id, weplay_id, url, created_at, metadata
  from public.analytics_events
  where event_name = 'page_view'
    and created_at > now() - interval '2 days'
  order by created_at desc
  limit greatest(coalesce(p_limit, 500), 1)
$$;

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
    and e.created_at > now() - interval '2 days'
  order by e.created_at desc
  limit greatest(coalesce(p_limit, 500), 1)
$$;

grant execute on function public.get_recent_analytics(integer) to anon, authenticated;
grant execute on function public.get_buy_clicks(integer) to anon, authenticated;
revoke execute on function public.get_recent_analytics(integer) from public;
revoke execute on function public.get_buy_clicks(integer) from public;