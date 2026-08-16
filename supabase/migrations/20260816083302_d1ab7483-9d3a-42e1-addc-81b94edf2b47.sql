-- Apply missing grants for Supabase Data API
-- The API requires explicit grants to expose tables/columns to the roles

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO anon, authenticated;

-- Ensure service_role has all permissions
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.blog_posts TO service_role;
GRANT ALL ON public.analytics_events TO service_role;
