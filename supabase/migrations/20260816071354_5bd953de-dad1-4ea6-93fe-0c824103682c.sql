-- Enums
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    event_name TEXT NOT NULL,
    metadata JSONB,
    url TEXT,
    user_agent TEXT,
    weplay_id TEXT
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.customers (
    weplay_id TEXT PRIMARY KEY,
    weplay_name TEXT NOT NULL,
    bonus_coins NUMERIC DEFAULT 0,
    total_coins NUMERIC DEFAULT 0,
    loyalty_tier TEXT DEFAULT 'Bronze',
    milestones_reached JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    last_active TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT UNIQUE NOT NULL,
    weplay_id TEXT NOT NULL,
    weplay_name TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    coins TEXT,
    coins_amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    upi_id TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
    CREATE POLICY "Public Read" ON public.blog_posts FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Insert" ON public.analytics_events FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Roles" ON public.user_roles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS \$\$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
\$\$;

CREATE OR REPLACE FUNCTION public.create_order(
  p_weplay_id text,
  p_weplay_name text,
  p_product_id text,
  p_product_name text,
  p_price numeric,
  p_coins text,
  p_coins_amount numeric,
  p_payment_method text,
  p_upi_id text DEFAULT ''
) RETURNS SETOF public.orders AS \$\$
DECLARE
  v_order_code text;
  v_order public.orders;
BEGIN
  v_order_code := 'ORD-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  
  INSERT INTO public.orders (
    order_code, weplay_id, weplay_name, product_id, product_name, 
    price, coins, coins_amount, payment_method, upi_id
  ) VALUES (
    v_order_code, p_weplay_id, p_weplay_name, p_product_id, p_product_name, 
    p_price, p_coins, p_coins_amount, p_payment_method, p_upi_id
  ) RETURNING * INTO v_order;

  -- Update customer record
  INSERT INTO public.customers (weplay_id, weplay_name, last_active)
  VALUES (p_weplay_id, p_weplay_name, now())
  ON CONFLICT (weplay_id) DO UPDATE 
  SET weplay_name = EXCLUDED.weplay_name, last_active = now();

  RETURN NEXT v_order;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;
