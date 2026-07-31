DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view customers" ON public.customers;

GRANT SELECT, UPDATE ON public.orders TO anon, authenticated;
GRANT SELECT ON public.customers TO anon, authenticated;

CREATE POLICY "Public can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can update order status" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view customers" ON public.customers FOR SELECT TO anon, authenticated USING (true);