create or replace function public.get_buy_clicks(p_limit integer default 500)
returns table (id uuid, weplay_id text, url text, created_at timestamptz, metadata jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select id, weplay_id, url, created_at, metadata
  from public.analytics_events
  where event_name in ('click_buy_now', 'payment_started', 'payment_verified', 'verification_started')
    and created_at > now() - interval '7 days'
  order by created_at desc
  limit greatest(coalesce(p_limit, 500), 1)
$$;

grant execute on function public.get_buy_clicks(integer) to anon, authenticated;
revoke execute on function public.get_buy_clicks(integer) from public;