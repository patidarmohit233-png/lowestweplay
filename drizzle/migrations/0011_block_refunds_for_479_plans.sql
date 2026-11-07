CREATE OR REPLACE FUNCTION public.request_refund(p_order_code text, p_weplay_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status text;
  v_price integer;
BEGIN
  SELECT o.status, o.price
  INTO v_status, v_price
  FROM public.orders AS o
  WHERE o.order_code = trim(p_order_code)
    AND lower(o.weplay_id) = lower(trim(p_weplay_id));

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_price = 479 OR lower(v_status) IN ('completed', 'refunded', 'failed', 'refund_rejected') THEN
    RETURN false;
  END IF;

  UPDATE public.orders AS o
  SET refund_requested = true, refund_requested_at = now()
  WHERE o.order_code = trim(p_order_code)
    AND lower(o.weplay_id) = lower(trim(p_weplay_id));

  RETURN true;
END;
$$;