-- Explicitly grant permissions to public schema tables
-- Supabase requires these GRANTS for the Data API to work

-- Orders
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Customers
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;

-- Blog Posts
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

-- Analytics
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
