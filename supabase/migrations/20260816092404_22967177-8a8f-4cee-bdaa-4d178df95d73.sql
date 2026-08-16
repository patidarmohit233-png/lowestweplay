
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS weplay_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS weplay_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coins_amount numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS upi_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_code text DEFAULT upper(substring(gen_random_uuid()::text from 1 for 6));

GRANT ALL ON public.orders TO anon, authenticated, service_role;
GRANT ALL ON public.customers TO anon, authenticated, service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for anon on orders" ON public.orders;
CREATE POLICY "Allow all for anon on orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow all for anon on customers" ON public.customers;
CREATE POLICY "Allow all for anon on customers" ON public.customers FOR ALL TO anon USING (true) WITH CHECK (true);
