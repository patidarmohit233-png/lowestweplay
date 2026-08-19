-- Re-grant access for service_role which is used by admin
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.analytics_events TO service_role;
GRANT ALL ON public.blog_posts TO service_role;
