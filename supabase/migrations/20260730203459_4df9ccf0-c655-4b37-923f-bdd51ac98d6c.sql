CREATE OR REPLACE FUNCTION public.get_customer_profile(p_weplay_id text)
RETURNS TABLE(
  weplay_id text,
  weplay_name text,
  total_coins integer,
  bonus_coins integer,
  loyalty_tier text,
  milestones_reached jsonb,
  order_count integer,
  completed_count integer,
  total_spent integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.weplay_id,
         c.weplay_name,
         c.total_coins,
         c.bonus_coins,
         c.loyalty_tier,
         c.milestones_reached,
         (SELECT count(*)::int FROM public.orders o WHERE lower(o.weplay_id) = lower(c.weplay_id)),
         (SELECT count(*)::int FROM public.orders o WHERE lower(o.weplay_id) = lower(c.weplay_id) AND o.status = 'completed'),
         (SELECT COALESCE(sum(o.price), 0)::int FROM public.orders o WHERE lower(o.weplay_id) = lower(c.weplay_id) AND o.status = 'completed')
  FROM public.customers c
  WHERE lower(c.weplay_id) = lower(trim(p_weplay_id))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_customer_profile(text) TO anon, authenticated, service_role;