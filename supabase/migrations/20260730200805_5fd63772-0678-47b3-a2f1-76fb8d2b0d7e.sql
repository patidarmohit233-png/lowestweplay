-- 1) customers table
CREATE TABLE public.customers (
  weplay_id text PRIMARY KEY,
  weplay_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view customers"
ON public.customers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2) orders upgrades
ALTER TABLE public.orders ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coins text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'razorpay';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_code text NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT UPDATE ON public.orders TO authenticated;

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) public (no-login) helper functions
CREATE OR REPLACE FUNCTION public.upsert_customer(p_weplay_id text, p_weplay_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(p_weplay_id)) < 3 OR length(trim(p_weplay_name)) < 2 THEN
    RAISE EXCEPTION 'invalid player details';
  END IF;
  INSERT INTO public.customers (weplay_id, weplay_name)
  VALUES (trim(p_weplay_id), trim(p_weplay_name))
  ON CONFLICT (weplay_id) DO UPDATE
    SET weplay_name = EXCLUDED.weplay_name, last_active = now();
END; $$;

CREATE OR REPLACE FUNCTION public.create_order(
  p_weplay_id text, p_weplay_name text, p_product_id text, p_product_name text,
  p_price integer, p_coins text, p_payment_method text
)
RETURNS TABLE (id uuid, order_code text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid; v_code text;
BEGIN
  IF p_payment_method NOT IN ('upi', 'razorpay') THEN
    RAISE EXCEPTION 'invalid payment method';
  END IF;
  IF p_price <= 0 OR p_price > 1000000 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;
  PERFORM public.upsert_customer(p_weplay_id, p_weplay_name);
  INSERT INTO public.orders (weplay_id, weplay_name, product_id, product_name, price, coins, payment_method, status)
  VALUES (trim(p_weplay_id), trim(p_weplay_name), p_product_id, left(p_product_name, 120), p_price, left(coalesce(p_coins, ''), 120), p_payment_method, 'pending')
  RETURNING orders.id, orders.order_code INTO v_id, v_code;
  RETURN QUERY SELECT v_id, v_code;
END; $$;

CREATE OR REPLACE FUNCTION public.attach_transaction(p_order_id uuid, p_transaction_id text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(p_transaction_id)) < 4 OR length(trim(p_transaction_id)) > 60 THEN
    RAISE EXCEPTION 'invalid transaction id';
  END IF;
  UPDATE public.orders
  SET transaction_id = trim(p_transaction_id), status = 'processing'
  WHERE id = p_order_id AND transaction_id IS NULL;
  RETURN FOUND;
END; $$;

CREATE OR REPLACE FUNCTION public.get_customer_orders(p_weplay_id text)
RETURNS TABLE (
  order_code text, product_name text, coins text, price integer,
  payment_method text, transaction_id text, status text, created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.order_code, o.product_name, o.coins, o.price,
         o.payment_method, o.transaction_id, o.status, o.created_at
  FROM public.orders o
  WHERE lower(o.weplay_id) = lower(trim(p_weplay_id))
  ORDER BY o.created_at DESC
  LIMIT 100;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_customer(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, integer, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attach_transaction(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_orders(text) TO anon, authenticated;
