CREATE OR REPLACE FUNCTION public.update_order_status(p_order_id uuid, p_status text, p_reason text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weplay_id text;
  v_price integer;
  v_product_id text;
  v_product_name text;
BEGIN
  IF lower(p_status) = 'refunded' THEN
    SELECT o.price, o.product_id, o.product_name
    INTO v_price, v_product_id, v_product_name
    FROM public.orders AS o
    WHERE o.id = p_order_id;

    IF NOT FOUND OR v_price = 479
       OR trim(v_product_id) IN ('1', '3')
       OR upper(trim(v_product_name)) IN ('10K RED PACKET', '10K GOLD') THEN
      RETURN false;
    END IF;
  END IF;

  UPDATE public.orders AS o
  SET status = lower(p_status),
      updated_at = now(),
      failure_reason = CASE
        WHEN lower(p_status) IN ('hold', 'failed', 'refunded')
        THEN COALESCE(NULLIF(trim(p_reason), ''), o.failure_reason)
        ELSE o.failure_reason
      END,
      refund_requested = CASE WHEN lower(p_status) = 'refunded' THEN false ELSE o.refund_requested END
  WHERE o.id = p_order_id
  RETURNING o.weplay_id INTO v_weplay_id;

  IF FOUND AND lower(p_status) = 'completed' THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
  END IF;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_order_status(p_order_id uuid, p_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weplay_id text;
  v_price integer;
  v_product_id text;
  v_product_name text;
BEGIN
  IF lower(p_status) = 'refunded' THEN
    SELECT o.price, o.product_id, o.product_name
    INTO v_price, v_product_id, v_product_name
    FROM public.orders AS o
    WHERE o.id = p_order_id;

    IF NOT FOUND OR v_price = 479
       OR trim(v_product_id) IN ('1', '3')
       OR upper(trim(v_product_name)) IN ('10K RED PACKET', '10K GOLD') THEN
      RETURN false;
    END IF;
  END IF;

  UPDATE public.orders AS o
  SET status = lower(p_status), updated_at = now()
  WHERE o.id = p_order_id
  RETURNING o.weplay_id INTO v_weplay_id;

  IF FOUND AND lower(p_status) = 'completed' THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
  END IF;

  RETURN FOUND;
END;
$$;