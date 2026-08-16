-- Drop existing overloaded versions of create_order to clean up schema cache
DROP FUNCTION IF EXISTS public.create_order(text, text, text, text, integer, text, text);
DROP FUNCTION IF EXISTS public.create_order(text, text, text, text, integer, text, integer, text);
DROP FUNCTION IF EXISTS public.create_order(text, text, text, text, integer, text, integer, text, text);

-- Create a single, clean version of create_order
CREATE OR REPLACE FUNCTION public.create_order(
  p_weplay_id text,
  p_weplay_name text,
  p_product_id text,
  p_product_name text,
  p_price integer,
  p_coins text,
  p_coins_amount integer,
  p_payment_method text,
  p_upi_id text DEFAULT NULL
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
  v_order_id uuid;
  v_order_code text;
BEGIN
  -- Generate a short unique order code (e.g., LW-XXXXXX)
  v_order_code := 'LW-' || upper(substring(md5(random()::text) from 1 for 6));
  
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
    status
  ) VALUES (
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
    'pending'
  )
  RETURNING public.orders.id, public.orders.order_code INTO v_order_id, v_order_code;
  
  RETURN QUERY SELECT v_order_id, v_order_code;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, integer, text, integer, text, text) TO anon, authenticated, service_role;
