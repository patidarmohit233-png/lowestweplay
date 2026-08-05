ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS upi_id text;

CREATE OR REPLACE FUNCTION public.create_order(p_weplay_id text, p_weplay_name text, p_product_id text, p_product_name text, p_price integer, p_coins text, p_coins_amount integer, p_payment_method text, p_upi_id text DEFAULT NULL)
 RETURNS TABLE(id uuid, order_code text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
  v_code text;
BEGIN
  IF p_payment_method NOT IN ('upi', 'razorpay') THEN
    RAISE EXCEPTION 'invalid payment method';
  END IF;
  IF p_price <= 0 OR p_price > 1000000 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;
  PERFORM public.upsert_customer(p_weplay_id, p_weplay_name);
  INSERT INTO public.orders (
    weplay_id, weplay_name, product_id, product_name, price,
    coins, coins_amount, payment_method, status, upi_id
  )
  VALUES (
    trim(p_weplay_id), trim(p_weplay_name), p_product_id, left(p_product_name, 120),
    p_price, left(coalesce(p_coins, ''), 120), p_coins_amount, p_payment_method, 'pending',
    left(nullif(trim(coalesce(p_upi_id, '')), ''), 120)
  )
  RETURNING orders.id, orders.order_code INTO v_id, v_code;
  RETURN QUERY SELECT v_id, v_code;
END;
$function$;