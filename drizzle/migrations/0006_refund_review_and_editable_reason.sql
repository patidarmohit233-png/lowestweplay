-- 1. Block refund requests on failed and refund_rejected orders too
CREATE OR REPLACE FUNCTION public.request_refund(p_order_code text, p_weplay_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  v_status text;
BEGIN
  SELECT status INTO v_status
  FROM public.orders
  WHERE order_code = trim(p_order_code)
    AND lower(weplay_id) = lower(trim(p_weplay_id));

  IF NOT FOUND THEN
    RETURN false;
  END IF;
  -- completed (already topped up), refunded, failed or refund-rejected orders cannot be requested
  IF lower(v_status) IN ('completed','refunded','failed','refund_rejected') THEN
    RETURN false;
  END IF;

  UPDATE public.orders
  SET refund_requested = true, refund_requested_at = now()
  WHERE order_code = trim(p_order_code)
    AND lower(weplay_id) = lower(trim(p_weplay_id));
  RETURN true;
END;
$fn$;

-- 2. Admin can edit the reason on any order at any time (not just once when setting status)
CREATE OR REPLACE FUNCTION public.admin_update_refund_reason(p_order_id uuid, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
BEGIN
  IF COALESCE(NULLIF(trim(p_reason), ''), '') = '' THEN
    RETURN false;
  END IF;

  UPDATE public.orders
  SET failure_reason = trim(p_reason), updated_at = now()
  WHERE id = p_order_id;
  RETURN FOUND;
END;
$fn$;

-- 3. Admin reviews a refund request: approve (-> refunded) or reject (-> refund_rejected); reason is required and shown to the customer
CREATE OR REPLACE FUNCTION public.admin_review_refund(p_order_id uuid, p_approve boolean, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
DECLARE
  v_weplay_id text;
BEGIN
  IF COALESCE(NULLIF(trim(p_reason), ''), '') = '' THEN
    RETURN false;
  END IF;

  UPDATE public.orders
  SET status = CASE WHEN p_approve THEN 'refunded' ELSE 'refund_rejected' END,
      failure_reason = trim(p_reason),
      updated_at = now(),
      refund_requested = CASE WHEN p_approve THEN false ELSE true END
  WHERE id = p_order_id AND refund_requested = true
  RETURNING weplay_id INTO v_weplay_id;

  IF FOUND AND p_approve THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
  END IF;
  RETURN FOUND;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.request_refund(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_refund_reason(uuid, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_review_refund(uuid, boolean, text) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.admin_update_refund_reason(uuid, text) IS 'Admin-only: edit the customer-visible reason on any order at any time';
COMMENT ON FUNCTION public.admin_review_refund(uuid, boolean, text) IS 'Admin-only: approve (refunded) or reject (refund_rejected) a customer refund request; reason is required';