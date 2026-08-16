
GRANT INSERT, UPDATE, SELECT ON public.customers TO anon, authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public upsert" ON public.customers;
CREATE POLICY "Allow public upsert" ON public.customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
