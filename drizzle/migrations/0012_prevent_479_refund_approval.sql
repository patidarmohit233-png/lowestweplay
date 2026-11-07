CREATE OR REPLACE FUNCTION public.admin_review_refund(p_order_id uuid, p_approve boolean, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weplay_id text;
  v_price integer;
BEGIN
  IF COALESCE(NULLIF(trim(p_reason), ''), '') = '' THEN
    RETURN false;
  END IF;

  SELECT o.price INTO v_price
  FROM public.orders AS o
  WHERE o.id = p_order_id AND o.refund_requested = true;

  IF NOT FOUND OR (p_approve AND v_price = 479) THEN
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