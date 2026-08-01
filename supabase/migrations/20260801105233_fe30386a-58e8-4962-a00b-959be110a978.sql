CREATE OR REPLACE FUNCTION public.attach_transaction(p_order_id uuid, p_transaction_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF length(trim(p_transaction_id)) < 4 OR length(trim(p_transaction_id)) > 60 THEN
    RAISE EXCEPTION 'invalid transaction id';
  END IF;
  UPDATE public.orders
  SET transaction_id = trim(p_transaction_id), status = 'pending', updated_at = now()
  WHERE id = p_order_id AND transaction_id IS NULL;
  RETURN FOUND;
END; $function$