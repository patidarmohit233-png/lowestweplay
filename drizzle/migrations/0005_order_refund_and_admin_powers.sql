-- Refund request flag + admin refund/delete powers
ALTER TABLE public.orders
  ADD COLUMN refund_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN refund_requested_at timestamptz;

-- Status update now accepts an admin reason (shown to the customer on hold/failed/refunded)
CREATE OR REPLACE FUNCTION public.update_order_status(p_order_id uuid, p_status text, p_reason text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_weplay_id text;
BEGIN
  UPDATE public.orders
  SET status = lower(p_status),
      updated_at = now(),
      failure_reason = CASE
        WHEN lower(p_status) IN ('hold','failed','refunded')
        THEN COALESCE(NULLIF(trim(p_reason), ''), failure_reason)
        ELSE failure_reason
      END,
      refund_requested = CASE WHEN lower(p_status) = 'refunded' THEN false ELSE refund_requested END
  WHERE id = p_order_id
  RETURNING weplay_id INTO v_weplay_id;

  IF FOUND AND lower(p_status) = 'completed' THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
  END IF;

  RETURN FOUND;
END;
$function$;

-- Admin can delete a fake order; loyalty coins are recalculated for that customer
CREATE OR REPLACE FUNCTION public.admin_delete_order(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_weplay_id text;
BEGIN
  DELETE FROM public.orders
  WHERE id = p_order_id
  RETURNING weplay_id INTO v_weplay_id;

  IF FOUND THEN
    PERFORM public.recalc_customer_loyalty(v_weplay_id);
    RETURN true;
  END IF;
  RETURN false;
END;
$function$;

-- Customer can request a refund on an order that was not topped up yet
CREATE OR REPLACE FUNCTION public.request_refund(p_order_code text, p_weplay_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
  -- completed (already topped up) or already refunded orders cannot be requested
  IF lower(v_status) IN ('completed','refunded') THEN
    RETURN false;
  END IF;

  UPDATE public.orders
  SET refund_requested = true, refund_requested_at = now()
  WHERE order_code = trim(p_order_code)
    AND lower(weplay_id) = lower(trim(p_weplay_id));
  RETURN true;
END;
$function$;

-- Customer order history now carries the admin reason and refund-request flag
-- (drop first: the return shape gains two columns)
DROP FUNCTION IF EXISTS public.get_customer_orders(text);
CREATE FUNCTION public.get_customer_orders(p_weplay_id text)
RETURNS TABLE(
  order_code text,
  product_name text,
  coins text,
  price integer,
  payment_method text,
  transaction_id text,
  status text,
  created_at timestamptz,
  failure_reason text,
  refund_requested boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT o.order_code, o.product_name, o.coins, o.price,
         o.payment_method, o.transaction_id, o.status, o.created_at,
         o.failure_reason, o.refund_requested
  FROM public.orders o
  WHERE lower(o.weplay_id) = lower(trim(p_weplay_id))
  ORDER BY o.created_at DESC
  LIMIT 100;
$function$;

GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_order(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_refund(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_orders(text) TO anon, authenticated;
