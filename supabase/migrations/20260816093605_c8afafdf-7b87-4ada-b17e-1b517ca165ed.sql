DROP POLICY IF EXISTS "Anon can insert analytics" ON public.analytics_events;
CREATE POLICY "Anon can insert analytics" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Anon can read analytics" ON public.analytics_events;
CREATE POLICY "Anon can read analytics" ON public.analytics_events FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT, INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;