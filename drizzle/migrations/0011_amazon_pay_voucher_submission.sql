CREATE OR REPLACE FUNCTION public.submit_voucher_order(
  p_weplay_id text,
  p_weplay_name text,
  p_product_id text,
  p_product_name text,
  p_price integer,
  p_coins_amount integer,
  p_redeem_code text,
  p_payment_method text
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders;
  v_code text := trim(coalesce(p_redeem_code, ''));
  v_weplay_id text := trim(coalesce(p_weplay_id, ''));
  v_method text := trim(coalesce(p_payment_method, ''));
BEGIN
  IF v_weplay_id = '' THEN
    RAISE EXCEPTION 'Missing WePlay ID. Please verify again.';
  END IF;
  IF length(v_code) < 4 OR length(v_code) > 200 THEN
    RAISE EXCEPTION 'Enter a valid Amazon Pay e-gift voucher code.';
  END IF;
  IF v_method <> 'amazon_pay_egift' THEN
    RAISE EXCEPTION 'Unsupported payment option.';
  END IF;
  IF coalesce(trim(p_product_id), '') = '' OR coalesce(trim(p_product_name), '') = '' OR p_price <= 0 THEN
    RAISE EXCEPTION 'Invalid package details.';
  END IF;

  INSERT INTO public.customers (weplay_id, weplay_name, last_active)
  VALUES (v_weplay_id, coalesce(nullif(trim(p_weplay_name), ''), 'Player'), now())
  ON CONFLICT (weplay_id) DO UPDATE SET last_active = now();

  INSERT INTO public.orders (
    weplay_id, weplay_name, product_id, product_name, price, coins_amount,
    payment_method, transaction_id, status
  ) VALUES (
    v_weplay_id, coalesce(nullif(trim(p_weplay_name), ''), 'Player'),
    trim(p_product_id), trim(p_product_name), p_price, greatest(coalesce(p_coins_amount, 0), 0),
    v_method, v_code, 'pending'
  )
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_voucher_order(text, text, text, text, integer, integer, text, text) TO anon, authenticated, service_role;