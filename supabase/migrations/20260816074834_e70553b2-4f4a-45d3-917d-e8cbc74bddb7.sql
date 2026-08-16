GRANT ALL ON public.analytics_events TO anon, authenticated, service_role;
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;
GRANT ALL ON public.customers TO anon, authenticated, service_role;
GRANT ALL ON public.orders TO anon, authenticated, service_role;
GRANT ALL ON public.user_roles TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.upsert_customer(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, numeric, text, numeric, text, text) TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';