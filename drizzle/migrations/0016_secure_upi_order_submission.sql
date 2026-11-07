CREATE OR REPLACE FUNCTION public.submit_upi_order(
  p_weplay_id text,
  p_weplay_name text,
  p_product_id text,
  p_transaction_id text
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders;
  v_price integer;
  v_coins integer;
  v_product_name text;
  v_reference text := trim(coalesce(p_transaction_id, ''));
  v_id text := trim(coalesce(p_product_id, ''));
BEGIN
  IF length(trim(coalesce(p_weplay_id, ''))) < 3 THEN
    RAISE EXCEPTION 'Please verify your WePlay ID again.';
  END IF;
  IF length(v_reference) < 6 OR length(v_reference) > 80 OR v_reference !~ '^[A-Za-z0-9_-]+$' THEN
    RAISE EXCEPTION 'Enter a valid UPI transaction reference (6–80 letters or numbers).';
  END IF;

  CASE v_id
    WHEN '1' THEN v_price := 479;  v_coins := 10000;  v_product_name := '10K RED PACKET';
    WHEN '2' THEN v_price := 1299; v_coins := 50000;  v_product_name := '50K RED PACKET';
    WHEN '3' THEN v_price := 479;  v_coins := 10000;  v_product_name := '10K GOLD';
    WHEN '4' THEN v_price := 1299; v_coins := 50000;  v_product_name := '50K GOLD';
    WHEN '5' THEN v_price := 2199; v_coins := 100000; v_product_name := '100K GOLD';
    WHEN '6' THEN v_price := 3299; v_coins := 250000; v_product_name := '250K GOLD';
    WHEN '7' THEN v_price := 5999; v_coins := 500000; v_product_name := '500K GOLD';
    ELSE RAISE EXCEPTION 'Unknown package. Please choose an available package.';
  END CASE;

  IF EXISTS (
    SELECT 1 FROM public.orders o
    WHERE lower(coalesce(o.transaction_id, '')) = lower(v_reference)
  ) THEN
    RAISE EXCEPTION 'This transaction reference has already been submitted.';
  END IF;

  INSERT INTO public.customers (weplay_id, weplay_name, last_active)
  VALUES (trim(p_weplay_id), coalesce(nullif(trim(p_weplay_name), ''), 'Player'), now())
  ON CONFLICT (weplay_id) DO UPDATE SET last_active = now();

  INSERT INTO public.orders (
    weplay_id, weplay_name, product_id, product_name, price, coins_amount,
    payment_method, transaction_id, status
  ) VALUES (
    trim(p_weplay_id), coalesce(nullif(trim(p_weplay_name), ''), 'Player'),
    v_id, v_product_name, v_price, v_coins,
    'razorpay', v_reference, 'pending'
  )
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_upi_order(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_upi_order(text, text, text, text) TO anon, authenticated, service_role;