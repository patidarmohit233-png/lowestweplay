-- Fix for database permissions and missing data mapping

-- 1. Ensure all public tables have correct grants for anon and authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon, authenticated;

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.analytics_events TO service_role;
GRANT ALL ON public.blog_posts TO service_role;

-- 2. Verify all RLS is enabled correctly
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Simplified but robust policies for public access
-- Orders
DROP POLICY IF EXISTS "Public Orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update order status" ON public.orders;
DROP POLICY IF EXISTS "Allow all for anon on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous update of transaction_id" ON public.orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Access" ON public.orders;

CREATE POLICY "Public Orders Access" ON public.orders
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Customers
DROP POLICY IF EXISTS "Public Customers" ON public.customers;
DROP POLICY IF EXISTS "Public can view customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public upsert" ON public.customers;
DROP POLICY IF EXISTS "Allow all for anon on customers" ON public.customers;
DROP POLICY IF EXISTS "Public Customers Access" ON public.customers;

CREATE POLICY "Public Customers Access" ON public.customers
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Blog Posts
DROP POLICY IF EXISTS "Public Read" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public Blog Access" ON public.blog_posts;

CREATE POLICY "Public Blog Access" ON public.blog_posts
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Analytics
DROP POLICY IF EXISTS "Public Insert" ON public.analytics_events;
DROP POLICY IF EXISTS "Enable insert for all" ON public.analytics_events;
DROP POLICY IF EXISTS "Enable read for authenticated" ON public.analytics_events;
DROP POLICY IF EXISTS "Anon can insert analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Anon can read analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Public Analytics Access" ON public.analytics_events;

CREATE POLICY "Public Analytics Access" ON public.analytics_events
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
