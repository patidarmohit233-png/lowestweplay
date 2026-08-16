
-- Drop existing functions to be absolutely sure
DROP FUNCTION IF EXISTS public.create_order(text, text, text, text, integer, text, integer, text, text);

-- Recreate with explicit types and consistent argument order
CREATE OR REPLACE FUNCTION public.create_order(
  p_weplay_id text,
  p_weplay_name text,
  p_product_id text,
  p_product_name text,
  p_price integer,
  p_coins text,
  p_coins_amount integer,
  p_payment_method text,
  p_upi_id text DEFAULT ''
)
RETURNS TABLE (
  id uuid,
  order_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_code text;
    v_order_id uuid;
BEGIN
    v_order_code := 'ORD-' || upper(substr(md5(random()::text), 1, 8));
    
    INSERT INTO public.orders (
        weplay_id,
        weplay_name,
        product_id,
        product_name,
        price,
        coins,
        coins_amount,
        payment_method,
        upi_id,
        order_code,
        status,
        created_at
    )
    VALUES (
        p_weplay_id,
        p_weplay_name,
        p_product_id,
        p_product_name,
        p_price,
        p_coins,
        p_coins_amount,
        p_payment_method,
        p_upi_id,
        v_order_code,
        'pending',
        now()
    )
    RETURNING public.orders.id INTO v_order_id;
    
    RETURN QUERY SELECT v_order_id, v_order_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, integer, text, integer, text, text) TO anon, authenticated, service_role;
