-- Drop and recreate functions with correct search_path and proper schema handling

-- 1. has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 2. create_order (Fixed parameter types and schema mapping)
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
) RETURNS SETOF public.orders LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 3. upsert_customer (Ensure it works for general login/verification)
CREATE OR REPLACE FUNCTION public.upsert_customer(
  p_weplay_id text,
  p_weplay_name text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (weplay_id, weplay_name, last_active)
  VALUES (p_weplay_id, p_weplay_name, now())
  ON CONFLICT (weplay_id) DO UPDATE 
  SET weplay_name = EXCLUDED.weplay_name, last_active = now();
END;
$$;

-- Re-grant execute to public for API access
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, numeric, text, numeric, text, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.upsert_customer(text, text) TO authenticated, anon;
