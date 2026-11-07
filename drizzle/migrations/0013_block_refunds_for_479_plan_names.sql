CREATE OR REPLACE FUNCTION public.request_refund(p_order_code text, p_weplay_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status text;
  v_price integer;
  v_product_id text;
  v_product_name text;
BEGIN
  SELECT o.status, o.price, o.product_id, o.product_name
  INTO v_status, v_price, v_product_id, v_product_name
  FROM public.orders AS o
  WHERE o.order_code = trim(p_order_code)
    AND lower(o.weplay_id) = lower(trim(p_weplay_id));

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_price = 479
     OR trim(v_product_id) IN ('1', '3')
     OR upper(trim(v_product_name)) IN ('10K RED PACKET', '10K GOLD')
     OR lower(v_status) IN ('completed', 'refunded', 'failed', 'refund_rejected') THEN
    RETURN false;
  END IF;

  UPDATE public.orders AS o
  SET refund_requested = true, refund_requested_at = now()
  WHERE o.order_code = trim(p_order_code)
    AND lower(o.weplay_id) = lower(trim(p_weplay_id));

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_review_refund(p_order_id uuid, p_approve boolean, p_reason text)
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
  IF COALESCE(NULLIF(trim(p_reason), ''), '') = '' THEN
    RETURN false;
  END IF;

  SELECT o.price, o.product_id, o.product_name
  INTO v_price, v_product_id, v_product_name
  FROM public.orders AS o
  WHERE o.id = p_order_id AND o.refund_requested = true;

  IF NOT FOUND OR (p_approve AND (
    v_price = 479
    OR trim(v_product_id) IN ('1', '3')
    OR upper(trim(v_product_name)) IN ('10K RED PACKET', '10K GOLD')
  )) THEN
    RETURN false;
  END IF;

  UPDATE public.orders AS o
  SET status = CASE WHEN p_approve THEN 'refunded' ELSE 'refund_rejected' END,
      failure_reason = trim(p_reason),
      updated_at = now(),
      refund_requested = CASE WHEN p_approve THEN false ELSE true END
  WHERE o.id = p_order_id AND o.refund_requested = true
  RETURNING o.weplay_id INTO v_weplay_id;

  IF FOUND AND p_approve THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
  END IF;

  RETURN FOUND;
END;
$$;